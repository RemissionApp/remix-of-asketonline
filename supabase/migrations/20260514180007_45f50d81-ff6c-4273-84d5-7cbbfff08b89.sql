CREATE TABLE public.numerology_deep_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  cache_key text NOT NULL,
  language text NOT NULL DEFAULT 'ru',
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_num_deep_cache_uk
  ON public.numerology_deep_cache (user_id, cache_key, language);

ALTER TABLE public.numerology_deep_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their deep readings"
  ON public.numerology_deep_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their deep readings"
  ON public.numerology_deep_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their deep readings"
  ON public.numerology_deep_cache FOR DELETE
  USING (auth.uid() = user_id);