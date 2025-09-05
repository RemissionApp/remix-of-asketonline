-- Create user onboarding state table for tracking completion steps
CREATE TABLE public.user_onboarding_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_step_completed BOOLEAN DEFAULT FALSE,
  onboarding_step_completed BOOLEAN DEFAULT FALSE,
  preferences_step_completed BOOLEAN DEFAULT FALSE,
  current_step TEXT DEFAULT 'profile',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_onboarding_state ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own onboarding state"
ON public.user_onboarding_state
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding state"
ON public.user_onboarding_state
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding state"
ON public.user_onboarding_state
FOR UPDATE
USING (auth.uid() = user_id);

-- Add performance indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_completion 
ON public.profiles (birth_date, name) 
WHERE birth_date IS NOT NULL AND name IS NOT NULL;

-- Add index for onboarding state
CREATE INDEX IF NOT EXISTS idx_user_onboarding_state_step 
ON public.user_onboarding_state (current_step, profile_step_completed);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_onboarding_state_updated_at
BEFORE UPDATE ON public.user_onboarding_state
FOR EACH ROW
EXECUTE FUNCTION public.update_onboarding_updated_at();

-- Create function to automatically create onboarding state for new users
CREATE OR REPLACE FUNCTION public.create_onboarding_state()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_onboarding_state (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create onboarding state
CREATE TRIGGER on_auth_user_create_onboarding_state
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_onboarding_state();