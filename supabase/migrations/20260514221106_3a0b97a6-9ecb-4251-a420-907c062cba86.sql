-- Add Stripe-specific fields to existing subscriptions table.
-- Existing native (RevenueCat) flow keeps working — these are all nullable.
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS price_id text,
  ADD COLUMN IF NOT EXISTS current_period_start timestamptz,
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS environment text;

-- Unique only when present, so native rows (NULL) don't collide.
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_subscription_uniq
  ON public.subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_idx
  ON public.subscriptions (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;