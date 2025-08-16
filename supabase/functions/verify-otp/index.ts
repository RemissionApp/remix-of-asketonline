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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerifyOtpRequest = await req.json();

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
      .single();

    if (codeError || !codeData) {
      console.error('Code verification error:', codeError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired code' 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

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

    // Mark code as used
    const { error: updateError } = await supabaseAdmin
      .from('email_verification_codes')
      .update({ used: true })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('Failed to mark code as used:', updateError);
      throw new Error('Failed to process verification');
    }

    // Get user by email and confirm their email
    const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Failed to get users:', getUserError);
      throw new Error('Failed to verify user');
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User not found' 
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update user's email_confirmed_at field
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true,
        app_metadata: {
          ...user.app_metadata,
          email_verified: true
        }
      }
    );

    if (confirmError) {
      console.error('Failed to confirm user email:', confirmError);
      throw new Error('Failed to confirm email');
    }

    console.log(`Email verified successfully for user: ${email}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email verified successfully',
      userId: user.id 
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