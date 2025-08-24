-- Add database indexes for performance optimization

-- Index for pact_days queries (most frequent)
CREATE INDEX IF NOT EXISTS idx_pact_days_pact_id_completed ON pact_days(pact_id, completed);
CREATE INDEX IF NOT EXISTS idx_pact_days_date ON pact_days(date);

-- Index for user-specific queries
CREATE INDEX IF NOT EXISTS idx_achievements_user_id_unlocked ON achievements(user_id, unlocked_at);
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_user_id_completed ON mission_progress_detailed(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_cosmic_artifacts_user_id ON cosmic_artifacts(user_id);

-- Index for profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_energy_points ON profiles(energy_points);
CREATE INDEX IF NOT EXISTS idx_profiles_total_days ON profiles(total_days);

-- Index for pact queries
CREATE INDEX IF NOT EXISTS idx_pacts_user_id_status ON pacts(user_id, status);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_universe_questions_user_created ON universe_questions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_universe_chat_messages_user_session ON universe_chat_messages(user_id, session_id);

-- Add database function for batch operations
CREATE OR REPLACE FUNCTION batch_delete_user_data(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete in correct order to respect foreign key constraints
  DELETE FROM pact_days WHERE pact_id IN (SELECT id FROM pacts WHERE user_id = target_user_id);
  DELETE FROM achievements WHERE user_id = target_user_id;
  DELETE FROM pacts WHERE user_id = target_user_id;
  DELETE FROM universe_questions WHERE user_id = target_user_id;
  DELETE FROM universe_chat_messages WHERE user_id = target_user_id;
  DELETE FROM universe_chat_sessions WHERE user_id = target_user_id;
  DELETE FROM missions WHERE user_id = target_user_id;
  DELETE FROM mission_progress WHERE user_id = target_user_id;
  DELETE FROM detailed_horoscopes WHERE user_id = target_user_id;
  DELETE FROM full_horoscopes WHERE user_id = target_user_id;
  DELETE FROM astro_profiles WHERE user_id = target_user_id;
  DELETE FROM numerology_readings WHERE user_id = target_user_id;
  DELETE FROM numerology_descriptions WHERE user_id = target_user_id;
  DELETE FROM push_subscriptions WHERE user_id = target_user_id;
  DELETE FROM subscriptions WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create optimized view for user progress
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
  p.id,
  p.energy_points,
  p.total_days,
  p.rank,
  (SELECT COUNT(*) FROM achievements a WHERE a.user_id = p.id AND a.unlocked_at IS NOT NULL) as achievements_count,
  (SELECT COUNT(*) FROM missions m WHERE m.user_id = p.id) as missions_count,
  (SELECT COUNT(*) FROM cosmic_artifacts ca WHERE ca.user_id = p.id) as artifacts_count,
  (SELECT COUNT(*) FROM mission_progress_detailed mpd WHERE mpd.user_id = p.id AND mpd.completed = true) as completed_missions_count
FROM profiles p;