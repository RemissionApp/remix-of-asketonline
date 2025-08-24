-- Исправляем критические проблемы безопасности

-- 1. Исправляем функции с мутабельным search_path
CREATE OR REPLACE FUNCTION public.update_numerology_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_mission_progress_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_push_subscriptions_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Создаем отсутствующую таблицу user_progress_summary с RLS
CREATE TABLE IF NOT EXISTS public.user_progress_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_missions INTEGER DEFAULT 0,
  completed_missions INTEGER DEFAULT 0,
  active_pacts INTEGER DEFAULT 0,
  total_achievements INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для user_progress_summary
ALTER TABLE public.user_progress_summary ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS для user_progress_summary
CREATE POLICY "Users can view their own progress summary" 
ON public.user_progress_summary 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress summary" 
ON public.user_progress_summary 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress summary" 
ON public.user_progress_summary 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Ограничиваем доступ к horoscope данным только для аутентифицированных пользователей
-- Проверяем существование таблицы raw_horoscopes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'raw_horoscopes' AND table_schema = 'public') THEN
    -- Включаем RLS если таблица существует
    ALTER TABLE public.raw_horoscopes ENABLE ROW LEVEL SECURITY;
    
    -- Создаем политику только для аутентифицированных пользователей
    CREATE POLICY "Only authenticated users can read horoscopes" 
    ON public.raw_horoscopes 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);
  END IF;
END
$$;