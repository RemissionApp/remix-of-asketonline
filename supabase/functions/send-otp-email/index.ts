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

// Email content translations
const emailTranslations = {
  en: {
    subject: 'Your verification code | Asceta',
    title: 'Verification Code',
    subtitle: 'Spiritual development and self-knowledge',
    codeLabel: 'Your verification code',
    validTime: 'Code valid for 5 minutes',
    instructions: 'Enter this code in the Asceta app to verify your email address. The code is valid for 5 minutes.',
    footerNote: 'If you didn\'t sign up for Asceta, please ignore this email.',
  },
  ru: {
    subject: 'Ваш код подтверждения | Asceta',
    title: 'Код подтверждения',
    subtitle: 'Духовное развитие и самопознание',
    codeLabel: 'Ваш код подтверждения',
    validTime: 'Код действителен 5 минут',
    instructions: 'Введите этот код в приложении Asceta для подтверждения вашего email адреса. Код действителен в течение 5 минут.',
    footerNote: 'Если вы не регистрировались в Asceta, проигнорируйте это письмо.',
  },
  es: {
    subject: 'Tu código de verificación | Asceta',
    title: 'Código de verificación',
    subtitle: 'Desarrollo espiritual y autoconocimiento',
    codeLabel: 'Tu código de verificación',
    validTime: 'Código válido por 5 minutos',
    instructions: 'Ingresa este código en la aplicación Asceta para verificar tu dirección de email. El código es válido por 5 minutos.',
    footerNote: 'Si no te registraste en Asceta, ignora este email.',
  }
};

function getEmailContent(language: string, code: string) {
  const lang = emailTranslations[language as keyof typeof emailTranslations] || emailTranslations.en;
  
  return {
    subject: lang.subject,
    html: `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${lang.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
            border: 1px solid rgba(139, 92, 246, 0.2);
          }
          
          .header {
            background: linear-gradient(135deg, hsl(260, 80%, 65%) 0%, hsl(258, 70%, 45%) 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: 
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
            animation: cosmic-float 6s ease-in-out infinite;
          }
          
          @keyframes cosmic-float {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
          }
          
          .logo {
            font-size: 36px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
          }
          
          .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
            position: relative;
            z-index: 1;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .code-section {
            background: linear-gradient(135deg, hsl(260, 80%, 65%) 0%, hsl(258, 70%, 45%) 100%);
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
          }
          
          .code-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          }
          
          .code-title {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
          }
          
          .code-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            position: relative;
            z-index: 1;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .code {
            font-size: 32px;
            font-weight: 700;
            color: hsl(260, 80%, 65%);
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .valid-time {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 10px;
            position: relative;
            z-index: 1;
          }
          
          .instructions {
            background: rgba(139, 92, 246, 0.1);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid rgba(139, 92, 246, 0.2);
          }
          
          .instructions-title {
            color: hsl(260, 80%, 65%);
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          
          .instructions-text {
            color: rgba(255, 255, 255, 0.8);
            font-size: 16px;
            line-height: 1.6;
          }
          
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid rgba(139, 92, 246, 0.2);
          }
          
          .footer-note {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            line-height: 1.5;
          }
          
          .stars {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(2px 2px at 20px 30px, #eee, transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, #fff, transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent);
            background-repeat: repeat;
            background-size: 200px 100px;
            animation: twinkle 4s linear infinite;
          }
          
          @keyframes twinkle {
            from { background-position: 0 0; }
            to { background-position: -200px 0; }
          }
          
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 16px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .code {
              font-size: 28px;
              letter-spacing: 6px;
            }
            
            .logo {
              font-size: 28px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="stars"></div>
          <div class="header">
            <div class="logo">Asceta</div>
            <div class="subtitle">${lang.subtitle}</div>
          </div>
          
          <div class="content">
            <div class="code-section">
              <div class="code-title">${lang.codeLabel}</div>
              <div class="code-container">
                <div class="code">${code}</div>
              </div>
              <div class="valid-time">${lang.validTime}</div>
            </div>
            
            <div class="instructions">
              <div class="instructions-title">${language === 'ru' ? 'Инструкции' : language === 'es' ? 'Instrucciones' : 'Instructions'}</div>
              <div class="instructions-text">${lang.instructions}</div>
            </div>
            
            <div class="footer">
              <div class="footer-note">${lang.footerNote}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

interface SendOtpRequest {
  email: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, language = 'en' }: SendOtpRequest = await req.json();

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

    // Multilingual email content
    const emailContent = getEmailContent(language, code);

    // Send email with OTP
    const emailResponse = await resend.emails.send({
      from: "Asket <noreply@remissionsoft.net>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
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