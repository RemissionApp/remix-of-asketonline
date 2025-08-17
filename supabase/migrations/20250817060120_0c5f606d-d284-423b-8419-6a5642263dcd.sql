-- Create table for storing complete numerology matrix calculations
CREATE TABLE public.numerology_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  birth_date DATE NOT NULL,
  name TEXT NOT NULL,
  matrix_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, birth_date, name)
);

-- Create table for storing AI-generated personalized descriptions
CREATE TABLE public.numerology_descriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reading_id UUID NOT NULL REFERENCES public.numerology_readings(id) ON DELETE CASCADE,
  description_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  language TEXT NOT NULL DEFAULT 'ru'
);

-- Enable Row Level Security
ALTER TABLE public.numerology_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numerology_descriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for numerology_readings
CREATE POLICY "Users can view their own numerology readings" 
ON public.numerology_readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own numerology readings" 
ON public.numerology_readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own numerology readings" 
ON public.numerology_readings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for numerology_descriptions
CREATE POLICY "Users can view their own numerology descriptions" 
ON public.numerology_descriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own numerology descriptions" 
ON public.numerology_descriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own numerology descriptions" 
ON public.numerology_descriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_numerology_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_numerology_readings_updated_at
BEFORE UPDATE ON public.numerology_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_numerology_updated_at_column();