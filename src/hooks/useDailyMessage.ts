
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';


/**
 * useDailyMessage
 * This hook does the following each time it's called:
 * 1) Count remaining messages with is_used = false for the therapist
 * 2) Execute based on rules:
 *    - >=3: Randomly pick and mark as used
 *    - ==1 or ==2: Pick and mark as used, then generate 5 new messages in background
 *    - ==0: Don't pick anything, show welcome message, and generate 5 new messages in background
 * 3) Return the picked message_text (if 0 messages, return null so UI shows welcome message)
 */
export const useDailyMessage = (therapistId?: string | null) => {
  
  const [dailyMessage, setDailyMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // status mainly used for UI hints (optional)
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
        // Background trigger: don't wait for result
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
          // First pick and display
          const msg = await pickMessage();
          if (!isCancelled) setDailyMessage(msg);

          // Then generate 5 messages in background
          setStatus('replenishing');
          await generateFive(false);
          setStatus('idle');
          return;
        }

        // remaining === 0: Use welcome message directly, generate in background
        setStatus('replenishing');
        await generateFive(false);
        setStatus('idle');
        // Don't pick daily message, keep dailyMessage as null
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
