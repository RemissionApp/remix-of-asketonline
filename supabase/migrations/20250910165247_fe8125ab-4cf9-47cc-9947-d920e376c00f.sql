-- Add attachment_url field to daily_reflections table for photo support
ALTER TABLE daily_reflections 
ADD COLUMN attachment_url text;

-- Add RLS policies for avatar storage if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mission-photos', 'mission-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for mission photos bucket
CREATE POLICY "Users can upload their own mission photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'mission-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own mission photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'mission-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own mission photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'mission-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own mission photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'mission-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add completed_date field to mission_progress_detailed for temporal control
ALTER TABLE mission_progress_detailed 
ADD COLUMN completed_date date;

-- Add unique constraint to prevent multiple completions on same day
CREATE UNIQUE INDEX mission_progress_daily_limit 
ON mission_progress_detailed (user_id, mission_id, completed_date) 
WHERE completed = true;