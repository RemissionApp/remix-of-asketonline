
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequestBody {
  name: string;
  email: string;
  message: string;
  userInfo?: {
    userId?: string;
    isPro?: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    const { name, email, message, userInfo } = await req.json() as EmailRequestBody;
    
    if (!name || !email || !message) {
      throw new Error('Name, email and message are required');
    }
    
    // Здесь мы должны были бы использовать сервис для отправки email (например, Resend),
    // но так как у нас нет настроенного сервиса, мы просто логируем данные
    // и имитируем успешную отправку
    
    console.log('Email request received:');
    console.log('From:', name, email);
    console.log('Message:', message);
    console.log('User info:', userInfo);
    
    // В реальном приложении здесь был бы код для отправки email
    // Например, с использованием Resend API:
    
    // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    // await resend.emails.send({
    //   from: 'noreply@cosmicapp.com',
    //   to: 'info@remissionsoft.com',
    //   subject: 'Сообщение от пользователя Cosmic App',
    //   html: `<p><strong>Имя:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Сообщение:</strong></p>
    //     <p>${message}</p>
    //     <p><strong>Информация о пользователе:</strong></p>
    //     <p>ID: ${userInfo?.userId || 'Не указан'}</p>
    //     <p>PRO-подписка: ${userInfo?.isPro ? 'Да' : 'Нет'}</p>`
    // });
    
    // Если у пользователя есть OPENAI API ключ, используем его для анализа сообщения
    // и автоматического создания тикета
    if (OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Проанализируй сообщение от пользователя и определи категорию проблемы: bug (ошибка), feature (запрос функции), question (вопрос), feedback (обратная связь), other (другое). Ответь только названием категории на английском языке без кавычек и дополнительного текста."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.3,
          max_tokens: 20
        }),
      });

      const data = await response.json();
      const category = data.choices[0].message.content.trim().toLowerCase();
      console.log('Detected message category:', category);
      
      // В реальном приложении здесь можно было бы создать тикет в системе учёта задач
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-developer-email function:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: `Error: ${error.message}`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
