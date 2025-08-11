-- Update the time-gated wrapper to keep 10 messages at 8 AM PT
CREATE OR REPLACE FUNCTION public.run_cleanup_if_8am_pacific()
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
      PERFORM public.cleanup_used_daily_messages(7, 10);
      PERFORM pg_advisory_unlock(981274, day_key);
    END IF;
  END IF;
END;
$function$;

-- Ensure a per-minute cron exists to invoke the wrapper
DO $$
BEGIN
  -- Remove any existing job with this name to avoid duplicates
  BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'run-daily-cleanup-every-minute') THEN
      PERFORM cron.unschedule('run-daily-cleanup-every-minute');
    END IF;
  EXCEPTION WHEN undefined_table OR undefined_function THEN
    NULL;
  END;

  -- Create (or re-create) the per-minute schedule
  BEGIN
    PERFORM cron.schedule(
      'run-daily-cleanup-every-minute',
      '* * * * *',
      'SELECT public.run_cleanup_if_8am_pacific();'
    );
  EXCEPTION WHEN undefined_function THEN
    -- If name-based schedule not available, ignore (older pg_cron versions)
    NULL;
  END;
END$$;

-- Run immediate cleanup now to enforce the new 10-message retention
SELECT public.cleanup_used_daily_messages(7, 10);
