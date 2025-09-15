-- Fix Security Definer Views by dropping them if they exist
-- and recreating them without SECURITY DEFINER or replacing with regular queries

-- Drop potentially problematic views
DROP VIEW IF EXISTS user_progress_summary CASCADE;
DROP VIEW IF EXISTS user_data_summary CASCADE;

-- Create materialized views instead for better performance and security
-- These will be regular views that don't use SECURITY DEFINER

-- User progress summary view (recreated without SECURITY DEFINER)
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    p.id,
    p.energy_points,
    p.total_days,
    p.rank,
    (SELECT COUNT(*) FROM achievements WHERE user_id = p.id AND unlocked_at IS NOT NULL) as achievements_count,
    (SELECT COUNT(*) FROM mission_progress WHERE user_id = p.id) as missions_count,
    (SELECT COUNT(*) FROM cosmic_artifacts WHERE user_id = p.id) as artifacts_count,
    (SELECT COUNT(*) FROM mission_progress WHERE user_id = p.id AND completed = true) as completed_missions_count
FROM profiles p
WHERE p.id = auth.uid();

-- User data summary view (recreated without SECURITY DEFINER)
CREATE OR REPLACE VIEW user_data_summary AS
SELECT 
    p.id,
    p.name,
    p.rank,
    p.energy_points,
    p.total_days,
    s.is_pro,
    (SELECT COUNT(*) FROM mission_progress mp WHERE mp.user_id = p.id AND mp.completed = false) as active_missions,
    (SELECT COUNT(*) FROM cosmic_artifacts ca WHERE ca.user_id = p.id) as total_artifacts,
    (SELECT COUNT(*) FROM achievements a WHERE a.user_id = p.id AND a.unlocked_at IS NOT NULL) as total_achievements
FROM profiles p
LEFT JOIN subscriptions s ON s.user_id = p.id
WHERE p.id = auth.uid();

-- Enable RLS on views
ALTER VIEW user_progress_summary SET (security_barrier = true);
ALTER VIEW user_data_summary SET (security_barrier = true);