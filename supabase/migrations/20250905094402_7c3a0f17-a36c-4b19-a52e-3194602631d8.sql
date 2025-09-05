-- Fix security warnings by adding search_path to functions

-- Update the onboarding timestamp function with secure search_path
CREATE OR REPLACE FUNCTION public.update_onboarding_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Update the onboarding state creation function with secure search_path
CREATE OR REPLACE FUNCTION public.create_onboarding_state()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_onboarding_state (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;