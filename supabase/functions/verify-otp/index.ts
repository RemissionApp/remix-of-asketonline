import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOtpRequest {
  email: string;
  code: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, password }: VerifyOtpRequest = await req.json();

    if (!email || !code || !password) {
      throw new Error('Email, code, and password are required');
    }

    console.log('Verifying OTP for email:', email, 'code:', code);

    // Check if code exists and is valid using maybeSingle to handle 0 rows gracefully
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .maybeSingle();

    if (codeError) {
      console.error('Database error during code verification:', codeError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database error during verification' 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!codeData) {
      console.log('No valid verification code found for email:', email, 'code:', code);
      
      // Check if code exists but is expired/used for better error message
      const { data: existingCode } = await supabaseAdmin
        .from('email_verification_codes')
        .select('used, expires_at')
        .eq('email', email)
        .eq('code', code)
        .maybeSingle();

      if (existingCode) {
        if (existingCode.used) {
          console.log('Code already used');
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Verification code has already been used' 
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        } else {
          console.log('Code expired');
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Verification code has expired' 
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid verification code' 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('Found valid verification code, proceeding with user creation');

    // Check if code has expired
    const now = new Date();
    const expiresAt = new Date(codeData.expires_at);
    
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code has expired' 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark code as used first
    const { error: updateError } = await supabaseAdmin
      .from('email_verification_codes')
      .update({ used: true })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('Failed to mark code as used:', updateError);
      throw new Error('Failed to process verification');
    }

    // Create new user with confirmed email
    console.log('Creating new user with email:', email);
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      app_metadata: {
        email_verified: true
      }
    });

    if (userError) {
      console.error('Failed to create user:', userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: userError.message || 'Failed to create user' 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('User created successfully:', userData.user?.id);

    // Generate access token for automatic sign-in
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${Deno.env.get('SITE_URL') || 'https://aewfggzscyjxpuciqtti.lovable.app'}/`
      }
    });

    if (sessionError) {
      console.error('Failed to generate session:', sessionError);
      // Still return success for user creation even if session generation fails
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'User created successfully',
        userId: userData.user?.id 
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    console.log('Registration completed successfully for:', email);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User created and verified successfully',
      userId: userData.user?.id,
      accessToken: sessionData.properties?.access_token,
      refreshToken: sessionData.properties?.refresh_token
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to verify OTP' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);