-- ======================================================================
-- COMPREHENSIVE SECURITY AND PERFORMANCE MIGRATION FOR 100K USERS
-- ======================================================================

-- 1. FIX CONFLICTING RLS POLICIES FOR raw_horoscopes
-- Remove conflicting anonymous access policy and keep only authenticated access
DROP POLICY IF EXISTS "Allow anonymous select on raw_horoscopes" ON raw_horoscopes;

-- 2. CREATE SECURE DATA OWNERSHIP VERIFICATION FUNCTIONS
-- Function to verify data ownership with proper security context
CREATE OR REPLACE FUNCTION verify_user_data_ownership(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Only allow access if the authenticated user matches the target user
  RETURN auth.uid() = target_user_id;
END;
$$;

-- 3. ADD PERFORMANCE INDEXES FOR 100K USERS SCALE
-- Compound indexes for most frequently accessed user data tables

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_lookup ON profiles(id, updated_at) WHERE id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_rank_energy ON profiles(rank, energy_points) WHERE rank IS NOT NULL;

-- Mission progress indexes  
CREATE INDEX IF NOT EXISTS idx_mission_progress_user_mission ON mission_progress(user_id, mission_id, completed);
CREATE INDEX IF NOT EXISTS idx_mission_progress_detailed_user_mission ON mission_progress_detailed(user_id, mission_id, day_number);

-- Daily reflections indexes
CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_mission_day ON daily_reflections(user_id, mission_id, day_number);

-- Cosmic artifacts indexes  
CREATE INDEX IF NOT EXISTS idx_cosmic_artifacts_user_active ON cosmic_artifacts(user_id, is_active, obtained_at);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user_unlocked ON achievements(user_id, unlocked_at) WHERE unlocked_at IS NOT NULL;

-- Pacts and pact days indexes
CREATE INDEX IF NOT EXISTS idx_pacts_user_status ON pacts(user_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_pact_days_pact_date ON pact_days(pact_id, date, completed);

-- Daily limits indexes for rate limiting
CREATE INDEX IF NOT EXISTS idx_daily_limits_user_date ON daily_limits(user_id, date);

-- Chat and universe data indexes
CREATE INDEX IF NOT EXISTS idx_universe_chat_sessions_user_updated ON universe_chat_sessions(user_id, last_message);
CREATE INDEX IF NOT EXISTS idx_universe_chat_messages_session_created ON universe_chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_universe_questions_user_created ON universe_questions(user_id, created_at);

-- Horoscope and astrology indexes
CREATE INDEX IF NOT EXISTS idx_detailed_horoscopes_user_date ON detailed_horoscopes(user_id, date);
CREATE INDEX IF NOT EXISTS idx_astro_profiles_user_updated ON astro_profiles(user_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_numerology_readings_user_updated ON numerology_readings(user_id, updated_at);

-- Subscription and onboarding indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, is_pro, subscription_end);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_step ON user_onboarding_state(user_id, current_step);

-- Cached horoscope optimization indexes (for shared data)
CREATE INDEX IF NOT EXISTS idx_cached_daily_horoscopes_lookup ON cached_daily_horoscopes(zodiac_sign, birth_year, date, language);
CREATE INDEX IF NOT EXISTS idx_cached_monthly_horoscopes_lookup ON cached_monthly_horoscopes(zodiac_sign, birth_year, month, year, language);
CREATE INDEX IF NOT EXISTS idx_cached_yearly_horoscopes_lookup ON cached_yearly_horoscopes(zodiac_sign, birth_year, target_year, language);

-- 4. STRENGTHEN RLS POLICIES WITH SECURITY FUNCTIONS
-- Update profiles RLS to use security function
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (verify_user_data_ownership(id));

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (verify_user_data_ownership(id));

-- Update mission progress RLS
DROP POLICY IF EXISTS "Users can view their own mission progress" ON mission_progress;
CREATE POLICY "Users can view their own mission progress" 
ON mission_progress FOR SELECT 
USING (verify_user_data_ownership(user_id));

-- 5. CREATE AUDIT LOG TABLE FOR CRITICAL OPERATIONS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow service role to read audit logs
CREATE POLICY "Service role can read audit logs" 
ON audit_logs FOR SELECT 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert audit logs" 
ON audit_logs FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- 6. CREATE AUDIT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only audit critical tables
    IF TG_TABLE_NAME IN ('profiles', 'subscriptions', 'pacts', 'cosmic_artifacts') THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            table_name,
            record_id,
            old_values,
            new_values,
            created_at
        ) VALUES (
            COALESCE(NEW.user_id, OLD.user_id, NEW.id, OLD.id),
            TG_OP,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
            CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
            now()
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 7. APPLY AUDIT TRIGGERS TO CRITICAL TABLES
DROP TRIGGER IF EXISTS audit_profiles_changes ON profiles;
CREATE TRIGGER audit_profiles_changes
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

DROP TRIGGER IF EXISTS audit_subscriptions_changes ON subscriptions;  
CREATE TRIGGER audit_subscriptions_changes
    AFTER INSERT OR UPDATE OR DELETE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- 8. STRENGTHEN NEW USER REGISTRATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    profile_exists BOOLEAN;
BEGIN
    -- Check if profile already exists to prevent duplicates
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = NEW.id) INTO profile_exists;
    
    IF NOT profile_exists THEN
        -- Create profile with validation
        INSERT INTO public.profiles (
            id, 
            name, 
            rank,
            energy_points,
            total_days,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
            'seeker',
            0,
            0,
            now(),
            now()
        );
        
        -- Create initial onboarding state
        INSERT INTO public.user_onboarding_state (
            user_id,
            current_step,
            profile_step_completed,
            onboarding_step_completed,
            preferences_step_completed,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            'profile',
            false,
            false,
            false,
            now(),
            now()
        ) ON CONFLICT (user_id) DO NOTHING;
        
        -- Create initial subscription record
        INSERT INTO public.subscriptions (
            user_id,
            is_pro,
            platform,
            product_id,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            false,
            'web',
            'free',
            now(),
            now()
        ) ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error and continue (don't block user creation)
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 9. CREATE PERFORMANCE MONITORING VIEW
CREATE OR REPLACE VIEW user_data_summary AS
SELECT 
    p.id,
    p.name,
    p.rank,
    p.energy_points,
    p.total_days,
    s.is_pro,
    COUNT(DISTINCT mp.mission_id) as active_missions,
    COUNT(DISTINCT ca.id) as total_artifacts,
    COUNT(DISTINCT a.id) as total_achievements
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
LEFT JOIN mission_progress mp ON p.id = mp.user_id AND mp.completed = false
LEFT JOIN cosmic_artifacts ca ON p.id = ca.user_id
LEFT JOIN achievements a ON p.id = a.user_id AND a.unlocked_at IS NOT NULL
GROUP BY p.id, p.name, p.rank, p.energy_points, p.total_days, s.is_pro;

-- 10. OPTIMIZE STORAGE FOR LARGE SCALE
-- Set appropriate autovacuum settings for high-traffic tables
ALTER TABLE profiles SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE mission_progress SET (
    autovacuum_vacuum_scale_factor = 0.2,
    autovacuum_analyze_scale_factor = 0.1
);

ALTER TABLE daily_reflections SET (
    autovacuum_vacuum_scale_factor = 0.2,
    autovacuum_analyze_scale_factor = 0.1
);

-- ======================================================================
-- MIGRATION COMPLETE
-- ======================================================================
-- This migration implements:
-- ✅ Fixed conflicting RLS policies in raw_horoscopes  
-- ✅ Added compound indexes for 100K user performance
-- ✅ Created secure data ownership verification functions
-- ✅ Strengthened RLS policies with security functions
-- ✅ Added comprehensive audit logging for critical operations
-- ✅ Enhanced new user registration with error handling
-- ✅ Optimized database settings for large scale
-- ✅ Preserved horoscope caching system (untouched)
-- ======================================================================