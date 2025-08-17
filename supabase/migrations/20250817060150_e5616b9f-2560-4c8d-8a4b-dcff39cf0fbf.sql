-- Drop trigger first, then recreate function and trigger with proper security
DROP TRIGGER IF EXISTS update_numerology_readings_updated_at ON public.numerology_readings;
DROP FUNCTION IF EXISTS public.update_numerology_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_numerology_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_numerology_readings_updated_at
BEFORE UPDATE ON public.numerology_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_numerology_updated_at_column();

-- Fix the existing handle_new_user function search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, 'Искатель');
  RETURN new;
END;
$$;