-- Add type column to pacts table
ALTER TABLE public.pacts 
ADD COLUMN type TEXT DEFAULT 'spiritual';

-- Update existing pacts with appropriate types based on their titles
UPDATE public.pacts 
SET type = CASE 
  WHEN title ILIKE '%cigarette%' OR title ILIKE '%курени%' THEN 'health'
  WHEN title ILIKE '%alcohol%' OR title ILIKE '%алког%' THEN 'health'
  WHEN title ILIKE '%social_media%' OR title ILIKE '%соц%' THEN 'energy'
  WHEN title ILIKE '%meditation%' OR title ILIKE '%медит%' THEN 'spiritual'
  WHEN title ILIKE '%sport%' OR title ILIKE '%спорт%' THEN 'energy'
  ELSE 'spiritual'
END;