-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, 'Искатель');
  RETURN new;
END;
$$;

-- Create RLS policy for subscriptions INSERT (missing)
CREATE POLICY "Users can create their own subscription" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policy for missions INSERT (missing)  
CREATE POLICY "Users can create their own missions"
ON public.missions
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policy for missions DELETE (missing)
CREATE POLICY "Users can delete their own missions"
ON public.missions
FOR DELETE
USING (auth.uid() = user_id);