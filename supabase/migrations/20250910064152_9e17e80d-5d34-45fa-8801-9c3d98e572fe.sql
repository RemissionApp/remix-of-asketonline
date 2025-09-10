-- Create global cache tables for horoscope reuse
CREATE TABLE public.cached_daily_horoscopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zodiac_sign TEXT NOT NULL,
  date DATE NOT NULL,
  birth_year INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'ru',
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(zodiac_sign, date, birth_year, language)
);

CREATE TABLE public.cached_monthly_horoscopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zodiac_sign TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  birth_year INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'ru',
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(zodiac_sign, month, year, birth_year, language)
);

CREATE TABLE public.cached_yearly_horoscopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zodiac_sign TEXT NOT NULL,
  target_year INTEGER NOT NULL,
  birth_year INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'ru',
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(zodiac_sign, target_year, birth_year, language)
);

-- Enable RLS on cache tables
ALTER TABLE public.cached_daily_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_monthly_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_yearly_horoscopes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read cached daily horoscopes" 
ON public.cached_daily_horoscopes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read cached monthly horoscopes" 
ON public.cached_monthly_horoscopes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read cached yearly horoscopes" 
ON public.cached_yearly_horoscopes 
FOR SELECT 
USING (true);

-- Create policies for service role write access
CREATE POLICY "Service role can insert cached daily horoscopes" 
ON public.cached_daily_horoscopes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can insert cached monthly horoscopes" 
ON public.cached_monthly_horoscopes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can insert cached yearly horoscopes" 
ON public.cached_yearly_horoscopes 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_cached_daily_lookup ON public.cached_daily_horoscopes(zodiac_sign, date, birth_year, language);
CREATE INDEX idx_cached_monthly_lookup ON public.cached_monthly_horoscopes(zodiac_sign, month, year, birth_year, language);
CREATE INDEX idx_cached_yearly_lookup ON public.cached_yearly_horoscopes(zodiac_sign, target_year, birth_year, language);