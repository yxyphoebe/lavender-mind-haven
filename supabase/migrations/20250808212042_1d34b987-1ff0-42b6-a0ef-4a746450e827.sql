-- Update cleanup cap to 10 and reschedule cron job

-- 1) Update function default to 10
CREATE OR REPLACE FUNCTION public.cleanup_used_daily_messages(
  max_days integer DEFAULT 7,
  max_per_pair integer DEFAULT 10
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete used messages older than max_days
  DELETE FROM public.daily_messages dm
  WHERE dm.is_used = true
    AND COALESCE(dm.used_at, dm.created_at) < now() - make_interval(days => max_days);

  -- Keep only the most recent max_per_pair used messages per (user_id, therapist_id)
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

-- 2) Ensure pg_cron is available
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3) Unschedule previous job if it exists, then schedule with 10
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
  $$ SELECT public.cleanup_used_daily_messages(7, 10); $$
);
