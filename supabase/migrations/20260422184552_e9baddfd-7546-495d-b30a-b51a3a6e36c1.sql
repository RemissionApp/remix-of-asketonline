CREATE OR REPLACE VIEW public.user_progress_summary
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.energy_points,
  p.total_days,
  p.rank,
  (SELECT COUNT(*) FROM public.achievements a WHERE a.user_id = p.id AND a.unlocked_at IS NOT NULL) AS achievements_count,
  (SELECT COUNT(*) FROM public.missions m WHERE m.user_id = p.id) AS missions_count,
  (SELECT COUNT(*) FROM public.cosmic_artifacts ca WHERE ca.user_id = p.id) AS artifacts_count,
  (SELECT COUNT(*) FROM public.mission_progress_detailed mpd WHERE mpd.user_id = p.id AND mpd.completed = true) AS completed_missions_count
FROM public.profiles p;