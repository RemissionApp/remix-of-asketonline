-- Deny-all policies on revenuecat_events (backend-only via service_role bypass)
CREATE POLICY "Block client access to revenuecat events"
  ON public.revenuecat_events FOR SELECT
  USING (false);

-- has_role can run as invoker since user_roles RLS already lets users read their own roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$function$;