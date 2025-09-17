import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface VerifyOtpSimpleRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerifyOtpSimpleRequest = await req.json();

    console.log('🔍 === VERIFY OTP SIMPLE FUNCTION START ===');
    console.log('📧 Email:', email);
    console.log('🔢 Code:', code);
    console.log('⏰ Server time:', new Date().toISOString());

    if (!email || !code) {
      throw new Error('Email and code are required');
    }

    // Check if code exists and is valid
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .maybeSingle();

    if (codeError) {
      console.error('❌ Database error during code verification:', codeError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Database error during verification',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    if (!codeData) {
      console.log('❌ No valid verification code found');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid verification code',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Check if code has expired
    const now = new Date();
    const expiresAt = new Date(codeData.expires_at);

    if (now > expiresAt) {
      console.log('❌ Code has expired');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Code has expired',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Mark code as used
    const { error: updateError } = await supabaseAdmin
      .from('email_verification_codes')
      .update({ used: true })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('Failed to mark code as used:', updateError);
    }

    console.log('✅ OTP verification successful');
    console.log('🔍 === VERIFY OTP SIMPLE FUNCTION END ===');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTP verified successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('💥 Exception in verify-otp-simple function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to verify OTP',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
