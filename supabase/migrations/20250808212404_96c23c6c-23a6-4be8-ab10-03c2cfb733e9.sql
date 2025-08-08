-- Revise cleanup to keep only most recent per pair, cap=20; drop time-based deletion

-- 1) Update cleanup function: keep only latest max_per_pair (default 20)
CREATE OR REPLACE FUNCTION public.cleanup_used_daily_messages(
  max_days integer DEFAULT 7,           -- kept for backward compat, ignored
  max_per_pair integer DEFAULT 20
)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Only enforce per-pair retention: keep most recent max_per_pair used messages
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

-- 2) Ensure pick_and_use function has a fixed search_path
CREATE OR REPLACE FUNCTION public.pick_and_use_random_daily_message(therapist_id_input text)
RETURNS TABLE(id uuid, message_text text)
LANGUAGE sql
SET search_path = public
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

-- 3) Ensure pg_cron exists and reschedule job with 20
CREATE EXTENSION IF NOT EXISTS pg_cron;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily_used_daily_messages_cleanup') THEN
    PERFORM cron.unschedule('daily_used_daily_messages_cleanup');
  END IF;
END;
$$;
SELECT cron.schedule(
  'daily_used_daily_messages_cleanup',
  '15 3 * * *',
  $$ SELECT public.cleanup_used_daily_messages(7, 20); $$
);
