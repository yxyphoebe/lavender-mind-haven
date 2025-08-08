
-- 1) 增加 used_at 字段（用于记录实际被“使用”的时间）
ALTER TABLE public.daily_messages
ADD COLUMN IF NOT EXISTS used_at timestamptz;

-- 回填历史：对已使用但未写 used_at 的记录，用 created_at 近似填充
UPDATE public.daily_messages
SET used_at = created_at
WHERE is_used = true
  AND used_at IS NULL;

-- 2) 更新“选用消息并标记为已使用”的 RPC 函数，记录 used_at = now()
CREATE OR REPLACE FUNCTION public.pick_and_use_random_daily_message(therapist_id_input text)
RETURNS TABLE(id uuid, message_text text)
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
  SET is_used = true,
      used_at = now()
  FROM chosen c
  WHERE dm.id = c.id
  RETURNING dm.id, dm.message_text;
$function$;

-- 3) 清理函数：删除超 7 天的已用消息；并按 (user_id, therapist_id) 只保留最近 30 条
CREATE OR REPLACE FUNCTION public.cleanup_used_daily_messages(
  max_days integer DEFAULT 7,
  max_per_pair integer DEFAULT 30
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- 3a) 删除超过 max_days 天的“已使用”消息
  DELETE FROM public.daily_messages dm
  WHERE dm.is_used = true
    AND COALESCE(dm.used_at, dm.created_at) < now() - make_interval(days => max_days);

  -- 3b) 对每个 (user_id, therapist_id) 的“已使用”消息只保留最近 max_per_pair 条
  WITH ranked AS (
    SELECT
      id,
      row_number() OVER (
        PARTITION BY user_id, therapist_id
        ORDER BY COALESCE(used_at, created_at) DESC, created_at DESC, id DESC
      ) AS rn
    FROM public.daily_messages
    WHERE is_used = true
      AND therapist_id IS NOT NULL
  )
  DELETE FROM public.daily_messages d
  USING ranked r
  WHERE d.id = r.id
    AND r.rn > max_per_pair;
END;
$$;

-- 4) 性能索引（可加速清理与查询）
CREATE INDEX IF NOT EXISTS daily_messages_is_used_used_at_idx
  ON public.daily_messages (is_used, used_at);

CREATE INDEX IF NOT EXISTS daily_messages_user_therapist_used_idx
  ON public.daily_messages (user_id, therapist_id, is_used, used_at);

-- 5) 启用 pg_cron 扩展（若已启用不会报错）
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 6) 每天 03:15 UTC 定时执行清理（命名任务）
SELECT cron.schedule(
  'daily_used_daily_messages_cleanup',
  '15 3 * * *',
  $$ SELECT public.cleanup_used_daily_messages(7, 30); $$
);
