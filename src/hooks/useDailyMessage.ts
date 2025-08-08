
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

/**
 * useDailyMessage
 * 每次调用都会：
 * 1) 统计该 therapist 剩余 is_used = false 的条数
 * 2) 根据规则执行：
 *    - >=3: 直接随机抽取并设为已用
 *    - ==2: 先抽取并设为已用，然后后台触发生成 5 条
 *    - ==0: 先生成 5 条，随后抽取并设为已用
 * 3) 返回抽取到的 message_text
 */
export const useDailyMessage = (therapistId?: string | null) => {
  const { toast } = useToast();
  const [dailyMessage, setDailyMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // status 主要用于在 UI 层做提示（可选）
  const [status, setStatus] = useState<'idle' | 'replenishing' | 'generating'>('idle');

  const normalizedTherapistId = useMemo(() => (therapistId || '').trim(), [therapistId]);

  useEffect(() => {
    let isCancelled = false;

    const pickMessage = async (): Promise<string | null> => {
      console.log('[useDailyMessage] calling RPC pick_and_use_random_daily_message for therapist:', normalizedTherapistId);
      const { data, error } = await supabase.rpc('pick_and_use_random_daily_message', {
        therapist_id_input: normalizedTherapistId,
      });
      if (error) {
        console.error('[useDailyMessage] RPC error:', error);
        return null;
      }
      const picked = Array.isArray(data) && data.length > 0 ? data[0] : null;
      const text = picked?.message_text ?? null;
      console.log('[useDailyMessage] picked message_text:', text);
      return text;
    };

    const generateFive = async (awaitResult = true) => {
      console.log('[useDailyMessage] triggering edge function generate-daily-messages (5 items)…');
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const url = 'https://vsiiedactvlzdvprwgkq.supabase.co/functions/v1/generate-daily-messages';
      const fetchPromise = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          therapist_id: normalizedTherapistId,
          count: 5,
        }),
      });

      if (awaitResult) {
        const resp = await fetchPromise;
        const ok = resp.ok;
        console.log('[useDailyMessage] generate response ok?', ok);
        if (!ok) {
          const text = await resp.text().catch(() => '');
          console.warn('[useDailyMessage] generate-daily-messages failed:', text);
        }
      } else {
        // 背景触发：不等待结果
        void fetchPromise.catch((e) => console.warn('[useDailyMessage] background generate failed:', e));
      }
    };

    const run = async () => {
      if (!normalizedTherapistId) {
        console.log('[useDailyMessage] therapistId missing, skip.');
        setDailyMessage(null);
        return;
      }

      setIsLoading(true);
      setStatus('idle');
      setDailyMessage(null);

      try {
        console.log('[useDailyMessage] counting remaining messages…');
        const { count, error: countError } = await supabase
          .from('daily_messages')
          .select('id', { count: 'exact', head: true })
          .eq('therapist_id', normalizedTherapistId)
          .eq('is_used', false);

        if (countError) {
          console.error('[useDailyMessage] count error:', countError);
          setDailyMessage(null);
          return;
        }

        const remaining = count ?? 0;
        console.log('[useDailyMessage] remaining unused messages:', remaining);

        if (remaining >= 3) {
          const msg = await pickMessage();
          if (!isCancelled) setDailyMessage(msg);
          return;
        }

        if (remaining === 2) {
          // 先抽取展示
          const msg = await pickMessage();
          if (!isCancelled) setDailyMessage(msg);

          // 再后台生成 5 条
          setStatus('replenishing');
          toast({
            title: '正在准备更多每日关怀',
            description: '我会在后台为你补充 5 条新消息。',
          });
          await generateFive(false);
          setStatus('idle');
          return;
        }

        // remaining === 0（或异常为0）：先生成，再抽取
        setStatus('generating');
        toast({
          title: '正在为你生成每日关怀',
          description: '稍等一下，我马上为你准备 5 条新消息。',
        });
        await generateFive(true);

        // 生成完成后抽取
        const msg = await pickMessage();
        if (!isCancelled) setDailyMessage(msg);
        setStatus('idle');
      } catch (e) {
        console.error('[useDailyMessage] unexpected error:', e);
        if (!isCancelled) setDailyMessage(null);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [normalizedTherapistId, toast]);

  return { dailyMessage, isLoading, status };
};
