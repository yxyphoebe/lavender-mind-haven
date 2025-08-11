-- 1) Update cleanup function default to keep only 10 used messages per user-therapist pair
CREATE OR REPLACE FUNCTION public.cleanup_used_daily_messages(max_days integer DEFAULT 7, max_per_pair integer DEFAULT 10)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
$function$;

-- 2) Remove any existing cron job that invokes the old wrapper or a previous job name
DO $$
BEGIN
  -- Try unscheduling by known name first (if it exists)
  BEGIN
    PERFORM cron.unschedule('cleanup-used-daily-messages-8am-pt');
  EXCEPTION WHEN undefined_function THEN
    -- Older pg_cron might not support name variant; ignore
    NULL;
  END;

  -- Unschedule any job that calls run_cleanup_if_8am_pacific()
  BEGIN
    PERFORM cron.unschedule(j.jobid)
    FROM cron.job j
    WHERE j.command ILIKE '%run_cleanup_if_8am_pacific%';
  EXCEPTION WHEN undefined_table THEN
    -- cron.job not available; ignore
    NULL;
  END;
END$$;

-- 3) Schedule new daily job at 08:00 America/Los_Angeles to keep only 10 used messages
SELECT cron.schedule(
  'cleanup-used-daily-messages-8am-pt',
  'CRON_TZ=America/Los_Angeles 0 8 * * *',
  $$ SELECT public.cleanup_used_daily_messages(7, 10); $$
);

-- 4) Run an immediate cleanup now
SELECT public.cleanup_used_daily_messages(7, 10);
