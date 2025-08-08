
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';


/**
 * useDailyMessage
 * 每次调用都会：
 * 1) 统计该 therapist 剩余 is_used = false 的条数
 * 2) 根据规则执行：
 *    - >=3: 直接随机抽取并设为已用
 *    - ==1 或 ==2: 先抽取并设为已用，然后后台触发生成 5 条
 *    - ==0: 不抽取，直接显示欢迎语，并在后台生成 5 条
 * 3) 返回抽取到的 message_text（若为 0 条，则返回 null 以便 UI 显示欢迎语）
 */
export const useDailyMessage = (therapistId?: string | null) => {
  
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
      const invokePromise = supabase.functions.invoke('generate-daily-messages', {
        body: {
          therapistId: normalizedTherapistId,
          count: 5,
        },
      });

      if (awaitResult) {
        const { data, error } = await invokePromise;
        console.log('[useDailyMessage] generate response error?', !!error);
        if (error) {
          console.warn('[useDailyMessage] generate-daily-messages failed:', error.message || error.name || error);
        }
      } else {
        // 背景触发：不等待结果
        void invokePromise
          .then(({ error }) => {
            if (error) console.warn('[useDailyMessage] background generate failed:', error.message || error);
          })
          .catch((e) => console.warn('[useDailyMessage] background generate exception:', e));
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

        if (remaining === 2 || remaining === 1) {
          // 先抽取展示
          const msg = await pickMessage();
          if (!isCancelled) setDailyMessage(msg);

          // 再后台生成 5 条
          setStatus('replenishing');
          await generateFive(false);
          setStatus('idle');
          return;
        }

        // remaining === 0：直接使用欢迎语，后台生成
        setStatus('replenishing');
        await generateFive(false);
        setStatus('idle');
        // 不抽取每日消息，保持 dailyMessage 为 null
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
  }, [normalizedTherapistId]);

  return { dailyMessage, isLoading, status };
};
