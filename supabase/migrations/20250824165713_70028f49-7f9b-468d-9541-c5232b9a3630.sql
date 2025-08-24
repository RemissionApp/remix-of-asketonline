-- Исправляем проблемы безопасности (часть 2)

-- 1. Исправляем оставшиеся функции с мутабельным search_path
CREATE OR REPLACE FUNCTION public.create_verification_code(p_email text, p_code text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  code_id uuid;
BEGIN
  -- Удаляем старые коды для этого email
  DELETE FROM public.email_verification_codes 
  WHERE email = p_email;
  
  -- Создаем новый код с истечением через 15 минут
  INSERT INTO public.email_verification_codes (email, code, expires_at)
  VALUES (p_email, p_code, now() + interval '15 minutes')
  RETURNING id INTO code_id;
  
  RETURN code_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_verification_code(p_email text, p_code text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  is_valid boolean := false;
BEGIN
  -- Удаляем просроченные коды
  DELETE FROM public.email_verification_codes 
  WHERE expires_at <= now();
  
  -- Проверяем код
  UPDATE public.email_verification_codes 
  SET used = true 
  WHERE email = p_email 
    AND code = p_code 
    AND expires_at > now() 
    AND used = false
  RETURNING true INTO is_valid;
  
  RETURN COALESCE(is_valid, false);
END;
$function$;

CREATE OR REPLACE FUNCTION public.batch_delete_user_data(target_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Delete in correct order to respect foreign key constraints
  DELETE FROM pact_days WHERE pact_id IN (SELECT id FROM pacts WHERE user_id = target_user_id);
  DELETE FROM achievements WHERE user_id = target_user_id;
  DELETE FROM pacts WHERE user_id = target_user_id;
  DELETE FROM universe_questions WHERE user_id = target_user_id;
  DELETE FROM universe_chat_messages WHERE user_id = target_user_id;
  DELETE FROM universe_chat_sessions WHERE user_id = target_user_id;
  DELETE FROM missions WHERE user_id = target_user_id;
  DELETE FROM mission_progress WHERE user_id = target_user_id;
  DELETE FROM detailed_horoscopes WHERE user_id = target_user_id;
  DELETE FROM full_horoscopes WHERE user_id = target_user_id;
  DELETE FROM astro_profiles WHERE user_id = target_user_id;
  DELETE FROM numerology_readings WHERE user_id = target_user_id;
  DELETE FROM numerology_descriptions WHERE user_id = target_user_id;
  DELETE FROM push_subscriptions WHERE user_id = target_user_id;
  DELETE FROM subscriptions WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, 'Искатель');
  RETURN new;
END;
$function$;

-- 2. Ограничиваем доступ к потенциально чувствительным данным
-- Проверяем и защищаем таблицы с гороскопами
DO $$
BEGIN
  -- Защищаем raw_horoscopes если существует
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'raw_horoscopes' AND table_schema = 'public') THEN
    ALTER TABLE public.raw_horoscopes ENABLE ROW LEVEL SECURITY;
    
    -- Проверяем, есть ли уже политики
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'raw_horoscopes' AND policyname = 'Only authenticated users can read horoscopes') THEN
      CREATE POLICY "Only authenticated users can read horoscopes" 
      ON public.raw_horoscopes 
      FOR SELECT 
      USING (auth.uid() IS NOT NULL);
    END IF;
  END IF;

  -- Защищаем другие таблицы с гороскопами
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'detailed_horoscopes' AND table_schema = 'public') THEN
    -- Проверяем RLS уже включен
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
                   WHERE n.nspname = 'public' AND c.relname = 'detailed_horoscopes' AND c.relrowsecurity = true) THEN
      ALTER TABLE public.detailed_horoscopes ENABLE ROW LEVEL SECURITY;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'full_horoscopes' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
                   WHERE n.nspname = 'public' AND c.relname = 'full_horoscopes' AND c.relrowsecurity = true) THEN
      ALTER TABLE public.full_horoscopes ENABLE ROW LEVEL SECURITY;
    END IF;
  END IF;
END
$$;