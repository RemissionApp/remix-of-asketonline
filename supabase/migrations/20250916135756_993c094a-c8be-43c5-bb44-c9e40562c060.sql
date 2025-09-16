-- Update RLS policies to allow service role operations during user creation

-- Update user_onboarding_state INSERT policy to allow service role
DROP POLICY IF EXISTS "Users can insert their own onboarding state" ON public.user_onboarding_state;

CREATE POLICY "Users can insert their own onboarding state" 
ON public.user_onboarding_state 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Update profiles INSERT policy to allow service role
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Update subscriptions INSERT policy to allow service role
DROP POLICY IF EXISTS "Users can create their own subscription" ON public.subscriptions;

CREATE POLICY "Users can create their own subscription" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');