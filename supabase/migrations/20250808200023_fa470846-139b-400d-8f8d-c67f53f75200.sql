
-- 1) 提升查询性能：为 daily_messages 建复合索引
CREATE INDEX IF NOT EXISTS idx_daily_messages_user_therapist_used
ON public.daily_messages (user_id, therapist_id, is_used);

-- 2) 原子操作：随机选取一条未使用的消息并标记为已用
-- 说明：
-- - 根据当前登录用户（auth.uid()）与 therapist_id_input 找到 is_used=false 的候选集合
-- - 随机挑选 1 条并在同一语句中将其设为 true
-- - 返回所选消息的 id 与 message_text
CREATE OR REPLACE FUNCTION public.pick_and_use_random_daily_message(therapist_id_input text)
RETURNS TABLE (id uuid, message_text text)
LANGUAGE sql
AS $function$
  WITH chosen AS (
    SELECT id, message_text
    FROM public.daily_messages
    WHERE user_id = auth.uid()
      AND therapist_id = therapist_id_input
      AND is_used = false
    ORDER BY random()
    LIMIT 1
  )
  UPDATE public.daily_messages AS dm
  SET is_used = true
  FROM chosen c
  WHERE dm.id = c.id
  RETURNING dm.id, dm.message_text;
$function$;
