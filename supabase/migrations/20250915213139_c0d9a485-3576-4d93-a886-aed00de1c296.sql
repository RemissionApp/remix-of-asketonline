-- Fix remaining Security Definer functions by replacing them with SECURITY INVOKER
-- This addresses the security linter warnings

-- Drop and recreate functions with SECURITY INVOKER instead of SECURITY DEFINER

-- Fix update_numerology_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_numerology_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix update_onboarding_updated_at function
CREATE OR REPLACE FUNCTION public.update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix create_onboarding_state function
CREATE OR REPLACE FUNCTION public.create_onboarding_state()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_onboarding_state (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix update_mission_progress_updated_at function
CREATE OR REPLACE FUNCTION public.update_mission_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix update_push_subscriptions_updated_at function
CREATE OR REPLACE FUNCTION public.update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix cleanup_old_audit_logs function
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Only allow service role to cleanup audit logs
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Access denied. Only service role can cleanup audit logs.';
    END IF;
    
    -- Delete audit logs older than 90 days
    DELETE FROM audit_logs 
    WHERE created_at < (now() - interval '90 days');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix create_verification_code function
CREATE OR REPLACE FUNCTION public.create_verification_code(p_email text, p_code text)
RETURNS UUID AS $$
DECLARE
  code_id uuid;
BEGIN
  -- Delete old codes for this email
  DELETE FROM public.email_verification_codes 
  WHERE email = p_email;
  
  -- Create new code expiring in 15 minutes
  INSERT INTO public.email_verification_codes (email, code, expires_at)
  VALUES (p_email, p_code, now() + interval '15 minutes')
  RETURNING id INTO code_id;
  
  RETURN code_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix validate_verification_code function
CREATE OR REPLACE FUNCTION public.validate_verification_code(p_email text, p_code text)
RETURNS BOOLEAN AS $$
DECLARE
  is_valid boolean := false;
BEGIN
  -- Delete expired codes
  DELETE FROM public.email_verification_codes 
  WHERE expires_at <= now();
  
  -- Validate code
  UPDATE public.email_verification_codes 
  SET used = true 
  WHERE email = p_email 
    AND code = p_code 
    AND expires_at > now() 
    AND used = false
  RETURNING true INTO is_valid;
  
  RETURN COALESCE(is_valid, false);
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix create_audit_log function
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    operation_user_id UUID;
    has_user_id_column BOOLEAN;
BEGIN
    -- Check if the table has a user_id column
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = TG_TABLE_NAME 
        AND column_name = 'user_id'
    ) INTO has_user_id_column;
    
    -- Extract user ID from the operation based on table structure
    IF has_user_id_column THEN
        operation_user_id := COALESCE(NEW.user_id, OLD.user_id);
    ELSE
        -- For tables like profiles where id is the user_id
        operation_user_id := COALESCE(NEW.id, OLD.id);
    END IF;
    
    -- Only audit if it's a critical table and user owns the data
    IF TG_TABLE_NAME IN ('profiles', 'subscriptions', 'pacts', 'cosmic_artifacts', 'user_onboarding_state') 
       AND (auth.uid() = operation_user_id OR auth.role() = 'service_role') THEN
        
        INSERT INTO audit_logs (
            user_id,
            action,
            table_name,
            record_id,
            old_values,
            new_values,
            created_at
        ) VALUES (
            operation_user_id,
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
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix batch_delete_user_data function
CREATE OR REPLACE FUNCTION public.batch_delete_user_data(target_user_id uuid)
RETURNS VOID AS $$
BEGIN
  -- Verify the user can only delete their own data
  IF auth.uid() != target_user_id AND auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied. Users can only delete their own data.';
  END IF;

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
  DELETE FROM user_onboarding_state WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;