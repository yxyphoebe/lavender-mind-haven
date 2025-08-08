-- Ensure pg_cron exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Wrapper: run cleanup only at 08:00 America/Los_Angeles, once per day
CREATE OR REPLACE FUNCTION public.run_cleanup_if_8am_pacific()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  now_pacific timestamptz := (now() AT TIME ZONE 'America/Los_Angeles');
  day_start_pacific timestamptz := date_trunc('day', now() AT TIME ZONE 'America/Los_Angeles');
  day_key int := floor(extract(epoch from day_start_pacific) / 86400)::int;
  got_lock boolean;
BEGIN
  -- Only run exactly at 08:00 Pacific
  IF extract(hour from now_pacific) = 8 AND extract(minute from now_pacific) = 0 THEN
    -- Ensure the job runs only once for the day using an advisory lock
    got_lock := pg_try_advisory_lock(981274, day_key);
    IF got_lock THEN
      PERFORM public.cleanup_used_daily_messages(7, 20);
      PERFORM pg_advisory_unlock(981274, day_key);
    END IF;
  END IF;
END;
$$;

-- Remove old daily job if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily_used_daily_messages_cleanup') THEN
    PERFORM cron.unschedule('daily_used_daily_messages_cleanup');
  END IF;
END;
$$;

-- Schedule: run every minute, wrapper decides whether to execute at 8 AM Pacific
SELECT cron.schedule(
  'daily_used_daily_messages_cleanup',
  '* * * * *',
  $$ SELECT public.run_cleanup_if_8am_pacific(); $$
);
