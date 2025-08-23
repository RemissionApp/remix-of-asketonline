-- Create detailed mission progress tracking
CREATE TABLE public.mission_progress_detailed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mission_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mission_id, day_number)
);

-- Create daily reflections table
CREATE TABLE public.daily_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mission_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  reflection_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mission_id, day_number)
);

-- Create mission choices table for interactive events
CREATE TABLE public.mission_choices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mission_id TEXT NOT NULL,
  choice_event_id TEXT NOT NULL,
  choice_id TEXT NOT NULL,
  consequences JSONB NOT NULL DEFAULT '[]',
  chosen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mission_id, choice_event_id)
);

-- Create cosmic artifacts collection table
CREATE TABLE public.cosmic_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  artifact_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT NOT NULL,
  effects JSONB NOT NULL DEFAULT '[]',
  obtained_from_mission TEXT,
  obtained_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, artifact_id)
);

-- Enable Row Level Security
ALTER TABLE public.mission_progress_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosmic_artifacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mission_progress_detailed
CREATE POLICY "Users can view their own detailed mission progress"
ON public.mission_progress_detailed
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own detailed mission progress"
ON public.mission_progress_detailed
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own detailed mission progress"
ON public.mission_progress_detailed
FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for daily_reflections
CREATE POLICY "Users can view their own daily reflections"
ON public.daily_reflections
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily reflections"
ON public.daily_reflections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily reflections"
ON public.daily_reflections
FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for mission_choices
CREATE POLICY "Users can view their own mission choices"
ON public.mission_choices
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mission choices"
ON public.mission_choices
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for cosmic_artifacts
CREATE POLICY "Users can view their own cosmic artifacts"
ON public.cosmic_artifacts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cosmic artifacts"
ON public.cosmic_artifacts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cosmic artifacts"
ON public.cosmic_artifacts
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_mission_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mission_progress_detailed_updated_at
BEFORE UPDATE ON public.mission_progress_detailed
FOR EACH ROW
EXECUTE FUNCTION public.update_mission_progress_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_mission_progress_detailed_user_mission ON public.mission_progress_detailed(user_id, mission_id);
CREATE INDEX idx_daily_reflections_user_mission ON public.daily_reflections(user_id, mission_id);
CREATE INDEX idx_mission_choices_user_mission ON public.mission_choices(user_id, mission_id);
CREATE INDEX idx_cosmic_artifacts_user ON public.cosmic_artifacts(user_id, obtained_at DESC);