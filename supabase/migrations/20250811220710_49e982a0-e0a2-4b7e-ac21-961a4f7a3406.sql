-- Safely update cleanup function default to 10 kept messages
CREATE OR REPLACE FUNCTION public.cleanup_used_daily_messages(max_days integer DEFAULT 7, max_per_pair integer DEFAULT 10)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
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
$function$;

-- Unschedule old jobs safely
DO $$
BEGIN
  -- If a job with the new name already exists, unschedule by name
  BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-used-daily-messages-8am-pt') THEN
      PERFORM cron.unschedule('cleanup-used-daily-messages-8am-pt');
    END IF;
  EXCEPTION WHEN undefined_table OR undefined_function THEN
    -- If cron.job table or name variant not available, ignore
    NULL;
  END;

  -- Unschedule any job that calls the old wrapper function
  BEGIN
    PERFORM cron.unschedule(j.jobid)
    FROM cron.job j
    WHERE j.command ILIKE '%run_cleanup_if_8am_pacific%';
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
END$$;

-- Schedule new daily job at 8 AM PT only if missing
DO $$
BEGIN
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-used-daily-messages-8am-pt') THEN
      PERFORM cron.schedule(
        'cleanup-used-daily-messages-8am-pt',
        'CRON_TZ=America/Los_Angeles 0 8 * * *',
        $$ SELECT public.cleanup_used_daily_messages(7, 10); $$
      );
    END IF;
  EXCEPTION WHEN undefined_table THEN
    -- Fallback: try to schedule directly
    PERFORM cron.schedule(
      'cleanup-used-daily-messages-8am-pt',
      'CRON_TZ=America/Los_Angeles 0 8 * * *',
      $$ SELECT public.cleanup_used_daily_messages(7, 10); $$
    );
  END;
END$$;

-- Run immediate cleanup now
SELECT public.cleanup_used_daily_messages(7, 10);
