
-- 1. Lock down subscriptions: remove user write access
DROP POLICY IF EXISTS "Users can create their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their subscription" ON public.subscriptions;

-- 2. RevenueCat event log for idempotency
CREATE TABLE IF NOT EXISTS public.revenuecat_events (
  event_id text PRIMARY KEY,
  user_id uuid,
  type text,
  event_timestamp_ms bigint,
  processed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.revenuecat_events ENABLE ROW LEVEL SECURITY;
-- No user-facing policies: only service_role accesses this table.

-- 3. Prevent duplicate pact day marks
CREATE UNIQUE INDEX IF NOT EXISTS pact_days_pact_date_unique
  ON public.pact_days(pact_id, date);

-- 4. Hardened batch_delete_user_data
CREATE OR REPLACE FUNCTION public.batch_delete_user_data(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF target_user_id IS NULL OR target_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: can only delete own data';
  END IF;

  DELETE FROM public.pact_days WHERE pact_id IN (SELECT id FROM public.pacts WHERE user_id = target_user_id);
  DELETE FROM public.achievements WHERE user_id = target_user_id;
  DELETE FROM public.pacts WHERE user_id = target_user_id;
  DELETE FROM public.universe_questions WHERE user_id = target_user_id;
  DELETE FROM public.universe_chat_messages WHERE user_id = target_user_id;
  DELETE FROM public.universe_chat_sessions WHERE user_id = target_user_id;
  DELETE FROM public.missions WHERE user_id = target_user_id;
  DELETE FROM public.mission_progress WHERE user_id = target_user_id;
  DELETE FROM public.mission_progress_detailed WHERE user_id = target_user_id;
  DELETE FROM public.daily_reflections WHERE user_id = target_user_id;
  DELETE FROM public.mission_choices WHERE user_id = target_user_id;
  DELETE FROM public.cosmic_artifacts WHERE user_id = target_user_id;
  DELETE FROM public.detailed_horoscopes WHERE user_id = target_user_id;
  DELETE FROM public.full_horoscopes WHERE user_id = target_user_id;
  DELETE FROM public.astro_profiles WHERE user_id = target_user_id;
  DELETE FROM public.numerology_descriptions WHERE user_id = target_user_id;
  DELETE FROM public.numerology_readings WHERE user_id = target_user_id;
  DELETE FROM public.push_subscriptions WHERE user_id = target_user_id;
  DELETE FROM public.subscriptions WHERE user_id = target_user_id;
  DELETE FROM public.daily_limits WHERE user_id = target_user_id;
  DELETE FROM public.user_onboarding_state WHERE user_id = target_user_id;
  DELETE FROM public.call_summaries WHERE user_id = target_user_id;
  DELETE FROM public.monthly_call_minutes WHERE user_id = target_user_id;
  DELETE FROM public.audit_logs WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
END;
$$;

-- 5. Hardened increment_call_minutes
CREATE OR REPLACE FUNCTION public.increment_call_minutes(p_user_id uuid, p_month_year text, p_minutes numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF p_user_id IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: can only increment own minutes';
  END IF;
  IF p_minutes IS NULL OR p_minutes < 0 OR p_minutes > 120 THEN
    RAISE EXCEPTION 'invalid minutes value';
  END IF;

  INSERT INTO public.monthly_call_minutes (user_id, month_year, minutes_used)
  VALUES (p_user_id, p_month_year, p_minutes)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET
    minutes_used = public.monthly_call_minutes.minutes_used + EXCLUDED.minutes_used,
    updated_at = now();
END;
$$;

-- 6. Helpful indexes
CREATE INDEX IF NOT EXISTS call_summaries_user_called_idx
  ON public.call_summaries(user_id, called_at DESC);
CREATE INDEX IF NOT EXISTS monthly_call_minutes_user_month_idx
  ON public.monthly_call_minutes(user_id, month_year);
