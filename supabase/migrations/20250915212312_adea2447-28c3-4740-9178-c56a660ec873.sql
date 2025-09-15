-- Fix audit trigger to handle tables without user_id column properly
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Create triggers for audit logging on critical tables
DROP TRIGGER IF EXISTS audit_profiles_trigger ON profiles;
CREATE TRIGGER audit_profiles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

DROP TRIGGER IF EXISTS audit_user_onboarding_state_trigger ON user_onboarding_state;
CREATE TRIGGER audit_user_onboarding_state_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_onboarding_state
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();