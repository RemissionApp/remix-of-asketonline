-- Trial fields on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '3 days'),
  ADD COLUMN IF NOT EXISTS payment_method_attached boolean NOT NULL DEFAULT false;

-- Trial fields on subscriptions
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'trialing';

-- Add a check via trigger (avoid CHECK constraint immutability concerns)
CREATE OR REPLACE FUNCTION public.validate_subscription_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status NOT IN ('trialing','active','past_due','canceled') THEN
    RAISE EXCEPTION 'Invalid subscription status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_subscription_status ON public.subscriptions;
CREATE TRIGGER trg_validate_subscription_status
BEFORE INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.validate_subscription_status();

-- Update handle_new_user to also create trial subscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, trial_started_at, trial_ends_at)
  VALUES (new.id, '', now(), now() + interval '3 days')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.subscriptions (user_id, is_pro, status, trial_ends_at, subscription_start)
  VALUES (new.id, false, 'trialing', now() + interval '3 days', now())
  ON CONFLICT DO NOTHING;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Make sure trigger on auth.users exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users: give them a fresh 3-day trial starting now
UPDATE public.profiles
SET trial_started_at = COALESCE(trial_started_at, now()),
    trial_ends_at = GREATEST(trial_ends_at, now() + interval '3 days');

INSERT INTO public.subscriptions (user_id, is_pro, status, trial_ends_at, subscription_start)
SELECT p.id, false, 'trialing', now() + interval '3 days', now()
FROM public.profiles p
LEFT JOIN public.subscriptions s ON s.user_id = p.id
WHERE s.id IS NULL;