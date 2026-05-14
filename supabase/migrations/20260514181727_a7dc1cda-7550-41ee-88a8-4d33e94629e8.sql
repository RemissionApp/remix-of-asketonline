-- 1. Answers Book table
CREATE TABLE IF NOT EXISTS public.numerology_saved_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  context text NOT NULL,
  focus_number integer,
  language text NOT NULL DEFAULT 'ru',
  content text NOT NULL,
  profile_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.numerology_saved_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved readings"
  ON public.numerology_saved_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their saved readings"
  ON public.numerology_saved_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved readings"
  ON public.numerology_saved_readings FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_numerology_saved_readings_user_created
  ON public.numerology_saved_readings (user_id, created_at DESC);

-- 2. revenuecat_events lockdown
REVOKE ALL ON public.revenuecat_events FROM anon, authenticated;

-- 3. validate_subscription_status search_path
CREATE OR REPLACE FUNCTION public.validate_subscription_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status NOT IN ('trialing','active','past_due','canceled') THEN
    RAISE EXCEPTION 'Invalid subscription status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$function$;

-- 4. Move pg_net to extensions schema (drop+recreate since pg_net lacks SET SCHEMA)
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 5. Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_verification_code(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_verification_code(text, text) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.batch_delete_user_data(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.batch_delete_user_data(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.increment_call_minutes(uuid, text, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_call_minutes(uuid, text, numeric) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;