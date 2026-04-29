-- Add profiles table to the realtime publication so clients can subscribe
-- to trial_ends_at changes without remounting components.
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
-- Ensure full row payload is delivered for UPDATE events.
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
