-- Add break_reason field to pacts table for storing interruption reasons
ALTER TABLE public.pacts 
ADD COLUMN break_reason TEXT;