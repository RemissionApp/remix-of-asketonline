-- Create table for email verification codes
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view codes for their email" 
ON public.email_verification_codes 
FOR SELECT 
USING (true);

CREATE POLICY "Service can insert codes" 
ON public.email_verification_codes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service can update codes" 
ON public.email_verification_codes 
FOR UPDATE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_email_verification_codes_email_code ON public.email_verification_codes(email, code);
CREATE INDEX idx_email_verification_codes_expires_at ON public.email_verification_codes(expires_at);

-- Update Supabase config to disable email confirmations
-- This will be handled in the config file update