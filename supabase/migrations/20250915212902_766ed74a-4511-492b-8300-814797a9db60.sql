-- Add missing profile_step_completed column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_step_completed BOOLEAN DEFAULT false;

-- Update existing users who have both name and birth_date to mark profile as complete
UPDATE public.profiles 
SET profile_step_completed = true 
WHERE name IS NOT NULL 
  AND name != '' 
  AND birth_date IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_profile_step_completed 
ON public.profiles(profile_step_completed);

-- Add trigger to automatically set profile_step_completed when profile is complete
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile is complete (has name and birth_date)
  IF NEW.name IS NOT NULL AND NEW.name != '' AND NEW.birth_date IS NOT NULL THEN
    NEW.profile_step_completed = true;
  ELSE
    NEW.profile_step_completed = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic profile completion updates
DROP TRIGGER IF EXISTS trigger_update_profile_completion ON public.profiles;
CREATE TRIGGER trigger_update_profile_completion
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_completion();