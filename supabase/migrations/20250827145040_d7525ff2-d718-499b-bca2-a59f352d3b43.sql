-- Update OTP expiry time to 10 minutes instead of 60 minutes for better security
UPDATE auth.config 
SET value = '600'  -- 10 minutes in seconds
WHERE parameter = 'SITE_URL';

-- Note: The above query is a placeholder as we cannot directly modify auth schema
-- The user should manually update this in Supabase Dashboard under Authentication > Settings
-- Set "Time before an OTP expires" to 10 minutes (600 seconds)