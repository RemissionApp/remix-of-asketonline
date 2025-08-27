import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateUserRequest {
  email: string;
  password: string;
  language?: string;
}

// Email templates
const getEmailTemplate = (code: string, language: string = 'en') => {
  switch (language) {
    case 'ru':
      return {
        subject: 'Код подтверждения для Asket',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 40px 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4fd1c7; font-size: 36px; margin: 0; text-shadow: 0 0 10px rgba(79, 209, 199, 0.3);">Asket</h1>
              <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 16px;">Ваш путь к познанию себя</p>
            </div>
            
            <div style="background: rgba(79, 209, 199, 0.1); border: 1px solid rgba(79, 209, 199, 0.3); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
              <h2 style="color: white; margin: 0 0 20px 0; font-size: 24px;">Добро пожаловать в Asket!</h2>
              <p style="color: #94a3b8; margin: 0 0 25px 0; font-size: 16px; line-height: 1.5;">
                Для завершения регистрации введите этот код подтверждения в приложении:
              </p>
              
              <div style="background: rgba(26, 26, 46, 0.8); border: 2px solid #4fd1c7; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4fd1c7; text-shadow: 0 0 10px rgba(79, 209, 199, 0.5);">
                  ${code}
                </div>
              </div>
              
              <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
                Код действителен в течение 15 минут
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                Если вы не регистрировались в Asket, проигнорируйте это письмо.
              </p>
            </div>
          </div>
        `,
      };
    case 'es':
      return {
        subject: 'Código de verificación para Asket',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 40px 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4fd1c7; font-size: 36px; margin: 0; text-shadow: 0 0 10px rgba(79, 209, 199, 0.3);">Asket</h1>
              <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 16px;">Tu camino hacia el autoconocimiento</p>
            </div>
            
            <div style="background: rgba(79, 209, 199, 0.1); border: 1px solid rgba(79, 209, 199, 0.3); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
              <h2 style="color: white; margin: 0 0 20px 0; font-size: 24px;">¡Bienvenido a Asket!</h2>
              <p style="color: #94a3b8; margin: 0 0 25px 0; font-size: 16px; line-height: 1.5;">
                Para completar tu registro, ingresa este código de verificación en la aplicación:
              </p>
              
              <div style="background: rgba(26, 26, 46, 0.8); border: 2px solid #4fd1c7; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4fd1c7; text-shadow: 0 0 10px rgba(79, 209, 199, 0.5);">
                  ${code}
                </div>
              </div>
              
              <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
                El código es válido por 15 minutos
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                Si no te registraste en Asket, ignora este correo.
              </p>
            </div>
          </div>
        `,
      };
    default:
      return {
        subject: 'Verification Code for Asket',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 40px 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4fd1c7; font-size: 36px; margin: 0; text-shadow: 0 0 10px rgba(79, 209, 199, 0.3);">Asket</h1>
              <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 16px;">Your path to self-discovery</p>
            </div>
            
            <div style="background: rgba(79, 209, 199, 0.1); border: 1px solid rgba(79, 209, 199, 0.3); border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
              <h2 style="color: white; margin: 0 0 20px 0; font-size: 24px;">Welcome to Asket!</h2>
              <p style="color: #94a3b8; margin: 0 0 25px 0; font-size: 16px; line-height: 1.5;">
                To complete your registration, enter this verification code in the app:
              </p>
              
              <div style="background: rgba(26, 26, 46, 0.8); border: 2px solid #4fd1c7; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4fd1c7; text-shadow: 0 0 10px rgba(79, 209, 199, 0.5);">
                  ${code}
                </div>
              </div>
              
              <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
                Code is valid for 15 minutes
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                If you didn't sign up for Asket, please ignore this email.
              </p>
            </div>
          </div>
        `,
      };
  }
};

const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, language = 'en' }: CreateUserRequest = await req.json();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    console.log(`Creating user: ${email}`);

    // Create user via admin API without sending confirmation email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't auto-confirm email
      user_metadata: {
        language: language
      }
    });

    if (userError) {
      console.error('Failed to create user:', userError);
      throw new Error(userError.message || 'Failed to create user');
    }

    if (!userData.user) {
      throw new Error('User creation failed - no user data returned');
    }

    console.log(`User created successfully: ${userData.user.id}`);

    // Generate OTP code
    const otpCode = generateOtpCode();

    // Store verification code in database
    const { data: codeData, error: codeError } = await supabaseAdmin
      .rpc('create_verification_code', {
        p_email: email,
        p_code: otpCode
      });

    if (codeError) {
      console.error('Failed to create verification code:', codeError);
      // Try to delete the created user if code creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      } catch (deleteError) {
        console.error('Failed to cleanup user after code creation error:', deleteError);
      }
      throw new Error('Failed to create verification code');
    }

    console.log(`Verification code created: ${codeData}`);

    // Send email with OTP
    const emailTemplate = getEmailTemplate(otpCode, language);
    
    const emailResult = await resend.emails.send({
      from: 'Asket <noreply@asket.ru>',
      to: [email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailResult.error) {
      console.error('Failed to send email:', emailResult.error);
      // Try to delete the created user if email sending fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
        await supabaseAdmin
          .from('email_verification_codes')
          .delete()
          .eq('email', email);
      } catch (deleteError) {
        console.error('Failed to cleanup after email error:', deleteError);
      }
      throw new Error('Failed to send verification email');
    }

    console.log(`Verification email sent successfully to: ${email}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User created and verification code sent',
      userId: userData.user.id,
      emailId: emailResult.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in create-user-with-otp function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create user' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);