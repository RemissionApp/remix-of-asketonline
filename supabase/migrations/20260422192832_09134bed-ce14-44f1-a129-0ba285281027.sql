-- Drop duplicate column from user_onboarding_state (single source of truth = profiles)
ALTER TABLE public.user_onboarding_state 
  DROP COLUMN IF EXISTS profile_step_completed;

-- Backfill: mark profile as complete for users who already filled name + birth_date
UPDATE public.profiles 
SET profile_step_completed = true 
WHERE name IS NOT NULL 
  AND name != '' 
  AND name != 'Искатель' 
  AND birth_date IS NOT NULL 
  AND (profile_step_completed = false OR profile_step_completed IS NULL);