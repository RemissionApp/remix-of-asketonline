-- Drop the foreign key constraint first, then change the column type to text
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_active_mission_fkey;

-- Change the column type to text to support string mission IDs
ALTER TABLE profiles ALTER COLUMN active_mission TYPE text;