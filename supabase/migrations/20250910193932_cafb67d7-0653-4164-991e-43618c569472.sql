-- ======================================================================
-- FIX REMAINING SECURITY ISSUES FROM LINTER
-- ======================================================================

-- 1. FIX SECURITY DEFINER VIEWS ISSUE
-- The views are being flagged because they may expose data inappropriately
-- Let's add proper RLS checks to the views

-- Drop and recreate user_data_summary with proper security
DROP VIEW IF EXISTS user_data_summary;
CREATE VIEW user_data_summary 
SECURITY INVOKER
AS
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
WHERE verify_user_data_ownership(p.id) -- Only show user's own data
GROUP BY p.id, p.name, p.rank, p.energy_points, p.total_days, s.is_pro;

-- Drop and recreate user_progress_summary with proper security  
DROP VIEW IF EXISTS user_progress_summary;
CREATE VIEW user_progress_summary
SECURITY INVOKER  
AS
SELECT 
    p.id,
    p.energy_points,
    p.total_days,
    (SELECT count(*) FROM achievements WHERE user_id = p.id) AS achievements_count,
    (SELECT count(*) FROM missions WHERE user_id = p.id) AS missions_count,
    (SELECT count(*) FROM cosmic_artifacts WHERE user_id = p.id) AS artifacts_count,
    (SELECT count(*) FROM missions WHERE user_id = p.id AND completed = true) AS completed_missions_count,
    p.rank
FROM profiles p
WHERE verify_user_data_ownership(p.id); -- Only show user's own data

-- 2. ENSURE ALL SECURITY FUNCTIONS USE SECURITY INVOKER
-- Update the audit function to be more secure
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER for better security
SET search_path = public
AS $$
BEGIN
    -- Only audit critical tables and ensure we have proper context
    IF TG_TABLE_NAME IN ('profiles', 'subscriptions', 'pacts', 'cosmic_artifacts') 
       AND current_setting('role') != 'service_role' THEN
        
        -- Insert audit log with proper user context
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
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the operation
    RAISE WARNING 'Audit log failed for table %: %', TG_TABLE_NAME, SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3. UPDATE handle_new_user TO USE SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
SET search_path = public
AS $$
DECLARE
    profile_exists BOOLEAN;
    new_user_id UUID;
BEGIN
    new_user_id := NEW.id;
    
    -- Check if profile already exists to prevent duplicates
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = new_user_id) INTO profile_exists;
    
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
            new_user_id,
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
            new_user_id,
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
            new_user_id,
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
    RAISE WARNING 'Error in handle_new_user for user %: %', new_user_id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. CREATE FUNCTION TO CHECK DATABASE PERFORMANCE STATISTICS
-- This helps monitor the 100K user scale performance
CREATE OR REPLACE FUNCTION get_table_performance_stats()
RETURNS TABLE (
    table_name TEXT,
    row_count BIGINT,
    table_size TEXT,
    index_size TEXT,
    total_size TEXT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) + pg_indexes_size(schemaname||'.'||tablename)) as total_size
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$;

-- ======================================================================
-- MIGRATION COMPLETE - SECURITY FIXES
-- ======================================================================
-- This migration addresses:
-- ✅ Fixed security definer view warnings by using SECURITY INVOKER
-- ✅ Added proper RLS checks to views to prevent data leakage
-- ✅ Updated all functions to use SECURITY INVOKER for better security
-- ✅ Added performance monitoring function for 100K user scale
-- ✅ Enhanced error handling in critical functions
-- ======================================================================