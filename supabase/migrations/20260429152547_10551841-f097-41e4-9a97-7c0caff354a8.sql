-- Enable scheduling + HTTP from Postgres
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove previous job if any
DO $$
DECLARE
  jid bigint;
BEGIN
  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'expire-trials-hourly';
  IF jid IS NOT NULL THEN
    PERFORM cron.unschedule(jid);
  END IF;
END $$;

-- Schedule hourly call to expire-trials edge function
SELECT cron.schedule(
  'expire-trials-hourly',
  '0 * * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://pbemnbaapzuwimlwelut.supabase.co/functions/v1/expire-trials',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZW1uYmFhcHp1d2ltbHdlbHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzcyMTYsImV4cCI6MjA5MjQ1MzIxNn0.tDaoBvCAcxq-TBpX_ZkR3ol7v8q1G0sdG_KahDpy1hY'
    ),
    body := '{}'::jsonb
  );
  $cron$
);