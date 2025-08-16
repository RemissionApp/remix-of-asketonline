import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOtpRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendOtpRequest = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store the code in database
    const { error: dbError } = await supabase
      .from('email_verification_codes')
      .insert({
        email,
        code,
        expires_at: expiresAt,
        used: false
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store verification code');
    }

    // Send email with OTP
    const emailResponse = await resend.emails.send({
      from: "Asket <noreply@resend.dev>",
      to: [email],
      subject: "Ваш код подтверждения | Your verification code",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; margin: 0;">Asket</h1>
            <p style="color: #666; margin: 10px 0;">Духовное развитие и самопознание</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
            <h2 style="color: white; margin: 0 0 20px 0;">Код подтверждения</h2>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 8px;">${code}</div>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Код действителен в течение 5 минут</p>
          </div>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #333;"><strong>🇷🇺 Русский:</strong></p>
            <p style="margin: 0 0 15px 0; color: #666;">Введите этот код в приложении Asket для подтверждения вашего email адреса. Код действителен 5 минут.</p>
            
            <p style="margin: 0 0 10px 0; color: #333;"><strong>🇬🇧 English:</strong></p>
            <p style="margin: 0; color: #666;">Enter this code in the Asket app to verify your email address. The code is valid for 5 minutes.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Если вы не регистрировались в Asket, проигнорируйте это письмо.<br>
              If you didn't sign up for Asket, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'OTP sent successfully',
      expiresAt 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send OTP' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);