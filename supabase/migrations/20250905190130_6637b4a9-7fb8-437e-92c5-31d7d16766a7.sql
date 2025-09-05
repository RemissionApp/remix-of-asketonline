-- Fix the security definer view by recreating user_progress_summary as a regular view
DROP VIEW IF EXISTS public.user_progress_summary;

CREATE VIEW public.user_progress_summary AS 
SELECT 
  p.id,
  p.energy_points,
  p.total_days,
  (SELECT COUNT(*) FROM achievements WHERE user_id = p.id) as achievements_count,
  (SELECT COUNT(*) FROM missions WHERE user_id = p.id) as missions_count,
  (SELECT COUNT(*) FROM cosmic_artifacts WHERE user_id = p.id) as artifacts_count,
  (SELECT COUNT(*) FROM missions WHERE user_id = p.id AND completed = true) as completed_missions_count,
  p.rank
FROM profiles p;