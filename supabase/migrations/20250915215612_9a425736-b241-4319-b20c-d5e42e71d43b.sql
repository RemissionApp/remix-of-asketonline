-- Fix handle_new_user function to be SECURITY DEFINER
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    profile_exists BOOLEAN;
    onboarding_exists BOOLEAN;
    subscription_exists BOOLEAN;
BEGIN
    -- Check if profile already exists to prevent duplicates
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = NEW.id) INTO profile_exists;
    SELECT EXISTS(SELECT 1 FROM user_onboarding_state WHERE user_id = NEW.id) INTO onboarding_exists;
    SELECT EXISTS(SELECT 1 FROM subscriptions WHERE user_id = NEW.id) INTO subscription_exists;
    
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
    END IF;
    
    IF NOT onboarding_exists THEN
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
        );
    END IF;
    
    IF NOT subscription_exists THEN
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
        );
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error and continue (don't block user creation)
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix remaining Security Definer Views by recreating them as Security Invoker
DROP VIEW IF EXISTS user_progress_summary CASCADE;
CREATE VIEW user_progress_summary 
WITH (security_invoker = true)
AS
SELECT 
    p.id,
    p.energy_points,
    p.total_days,
    p.rank,
    COUNT(DISTINCT a.id) as achievements_count,
    COUNT(DISTINCT mp.id) as missions_count,
    COUNT(DISTINCT ca.id) as artifacts_count,
    COUNT(DISTINCT CASE WHEN mp.completed = true THEN mp.id END) as completed_missions_count
FROM profiles p
LEFT JOIN achievements a ON p.id = a.user_id
LEFT JOIN mission_progress mp ON p.id = mp.user_id
LEFT JOIN cosmic_artifacts ca ON p.id = ca.user_id
GROUP BY p.id, p.energy_points, p.total_days, p.rank;

DROP VIEW IF EXISTS user_data_summary CASCADE;
CREATE VIEW user_data_summary
WITH (security_invoker = true)
AS
SELECT 
    p.id,
    p.name,
    p.rank,
    p.energy_points,
    p.total_days,
    s.is_pro,
    COUNT(DISTINCT mp.id) FILTER (WHERE mp.completed = false) as active_missions,
    COUNT(DISTINCT ca.id) as total_artifacts,
    COUNT(DISTINCT a.id) as total_achievements
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
LEFT JOIN mission_progress mp ON p.id = mp.user_id
LEFT JOIN cosmic_artifacts ca ON p.id = ca.user_id
LEFT JOIN achievements a ON p.id = a.user_id
GROUP BY p.id, p.name, p.rank, p.energy_points, p.total_days, s.is_pro;