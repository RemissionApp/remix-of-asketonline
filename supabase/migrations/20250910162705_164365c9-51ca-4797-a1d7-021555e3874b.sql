-- Fix mission_id type to support string IDs
ALTER TABLE mission_progress ALTER COLUMN mission_id TYPE text;

-- Also fix mission_progress_detailed table
ALTER TABLE mission_progress_detailed ALTER COLUMN mission_id TYPE text;