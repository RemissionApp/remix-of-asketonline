-- First, drop the foreign key constraint if it exists
ALTER TABLE mission_progress DROP CONSTRAINT IF EXISTS mission_progress_mission_id_fkey;

-- Then change the column type to text
ALTER TABLE mission_progress ALTER COLUMN mission_id TYPE text;

-- Also fix mission_progress_detailed table
ALTER TABLE mission_progress_detailed DROP CONSTRAINT IF EXISTS mission_progress_detailed_mission_id_fkey; 
ALTER TABLE mission_progress_detailed ALTER COLUMN mission_id TYPE text;