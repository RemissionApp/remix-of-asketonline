-- Fix active_mission field type in profiles table to support string mission IDs
ALTER TABLE profiles ALTER COLUMN active_mission TYPE text;