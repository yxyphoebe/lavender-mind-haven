-- Reschedule daily cleanup to 8 AM America/Los_Angeles
-- Ensure pg_cron exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop existing job if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily_used_daily_messages_cleanup') THEN
    PERFORM cron.unschedule('daily_used_daily_messages_cleanup');
  END IF;
END;
$$;

-- Schedule using CRON_TZ for timezone-aware execution at 08:00 America/Los_Angeles
-- Note: Requires pg_cron with CRON_TZ support (Supabase supports this)
SELECT cron.schedule(
  'daily_used_daily_messages_cleanup',
  'CRON_TZ=America/Los_Angeles 0 8 * * *',
  $$ SELECT public.cleanup_used_daily_messages(7, 20); $$
);
