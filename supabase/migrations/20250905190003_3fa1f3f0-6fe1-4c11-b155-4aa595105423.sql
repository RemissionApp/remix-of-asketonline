-- Create daily_limits table for tracking user usage
CREATE TABLE public.daily_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  universe_questions_count integer NOT NULL DEFAULT 0,
  voice_calls_count integer NOT NULL DEFAULT 0,
  meditations_count integer NOT NULL DEFAULT 0,
  cosmic_missions_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_limits
CREATE POLICY "Users can view their own daily limits" 
ON public.daily_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily limits" 
ON public.daily_limits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily limits" 
ON public.daily_limits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_daily_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_limits_updated_at
BEFORE UPDATE ON public.daily_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_daily_limits_updated_at();