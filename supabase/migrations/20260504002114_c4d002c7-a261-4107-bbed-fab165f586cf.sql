
CREATE TABLE IF NOT EXISTS public.call_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  called_at timestamptz NOT NULL DEFAULT now(),
  duration_seconds integer,
  summary text,
  key_topics text[],
  emotional_tone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.call_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their call summaries"
  ON public.call_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their call summaries"
  ON public.call_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their call summaries"
  ON public.call_summaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their call summaries"
  ON public.call_summaries FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_call_summaries_user_called
  ON public.call_summaries (user_id, called_at DESC);

CREATE TABLE IF NOT EXISTS public.monthly_call_minutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  month_year text NOT NULL,
  minutes_used numeric(6,2) NOT NULL DEFAULT 0,
  minutes_limit integer NOT NULL DEFAULT 30,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, month_year)
);

ALTER TABLE public.monthly_call_minutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their minutes"
  ON public.monthly_call_minutes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their minutes"
  ON public.monthly_call_minutes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their minutes"
  ON public.monthly_call_minutes FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.increment_call_minutes(
  p_user_id uuid,
  p_month_year text,
  p_minutes numeric
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.monthly_call_minutes (user_id, month_year, minutes_used)
  VALUES (p_user_id, p_month_year, p_minutes)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET
    minutes_used = public.monthly_call_minutes.minutes_used + EXCLUDED.minutes_used,
    updated_at = now();
END;
$$;
