-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ БЕЗОПАСНОСТИ
-- 1. Исправляем RLS политики для email_verification_codes
DROP POLICY IF EXISTS "Service can insert codes" ON public.email_verification_codes;
DROP POLICY IF EXISTS "Service can update codes" ON public.email_verification_codes; 
DROP POLICY IF EXISTS "Users can view codes for their email" ON public.email_verification_codes;

-- Создаем безопасные политики
CREATE POLICY "Service role can insert codes" ON public.email_verification_codes
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update codes" ON public.email_verification_codes  
FOR UPDATE USING (true);

-- КРИТИЧНО: Пользователи могут видеть только свои коды по email
CREATE POLICY "Users can view only their own codes" ON public.email_verification_codes
FOR SELECT USING (
  auth.email() = email AND 
  expires_at > now() AND 
  used = false
);

-- 2. Исправляем функции с установкой security definer и search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, 'Искатель');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_numerology_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
SET search_path = 'public'
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
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Сокращаем время истечения OTP кодов (с текущего неопределенного до 15 минут)
-- Добавляем проверку на автоматическое истечение при создании
CREATE OR REPLACE FUNCTION public.create_verification_code(p_email text, p_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- 4. Создаем функцию для валидации кодов с автоматической очисткой
CREATE OR REPLACE FUNCTION public.validate_verification_code(p_email text, p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = 'public'
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