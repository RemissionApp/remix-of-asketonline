
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  question: string;
  userData?: {
    userName?: string;
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
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { question, userData } = await req.json() as RequestBody;
    
    if (!question || question.trim() === '') {
      throw new Error('Question is required');
    }
    
    // Информация о приложении
    const appInfo = `
Приложение "Cosmic" (Космик) - это духовное приложение для личностного роста, которое помогает пользователям:

1. Проходить духовные практики (аскезы) на выбранный срок (30, 60, 90 дней или свой вариант)
2. Получать информацию о своем знаке зодиака
3. Получать ежедневный гороскоп
4. Взаимодействовать с "Вселенной" (задавать вопросы и получать мудрые ответы)
5. Для PRO-пользователей: получать расширенную информацию о гороскопах, нумерологии и использовать чат с "Вселенной"
6. Практиковать медитации
7. Выполнять духовные миссии

Основные функции приложения:
- Создание аскез (обетов): пользователь выбирает практику, количество дней и получает ежедневные напоминания
- Ежедневный гороскоп: краткий прогноз на день
- Подробный гороскоп (для PRO): расширенная информация по различным сферам жизни
- Нумерология (для PRO): числовой анализ и прогнозы
- Общение с "Вселенной": пользователи могут задавать вопросы и получать мудрые ответы
- Профиль пользователя: хранит информацию о знаке зодиака, рейтинге и достижениях
- Система рангов духовного роста: seeker (искатель), pilgrim (пилигрим), warrior (воин света), master (мастер), enlightened (просветлённый)

Популярные запросы пользователей:
- Как создать новую аскезу?
- Как использовать чат с Вселенной?
- Как получить PRO подписку?
- Почему не отображается мой знак зодиака?
- Как посмотреть историю своих аскез?
- Как работает система рангов?
- Как сменить язык в приложении?
- Как мне обновить свой профиль?
`;
    
    // System prompt
    const systemPrompt = `Ты - ассистент поддержки для приложения "Cosmic" (Космик). Твоя задача - помогать пользователям с их вопросами о приложении.

Вот информация о приложении:
${appInfo}

Важные правила:
1. Всегда будь вежливым, краткими и информативным.
2. Если пользователь задает вопрос, который не связан с приложением, вежливо перенаправь его обратно к теме приложения.
3. Если не знаешь ответа, предложи пользователю связаться с разработчиками по email: info@remissionsoft.com
4. Используй дружелюбный, но профессиональный тон.
5. Отвечай на том же языке, на котором задан вопрос (русский, английский или испанский).
6. Если пользователя интересует PRO-подписка, объясни, что она дает расширенные функции: полный гороскоп, нумерологию и чат с Вселенной.`;
    
    // User prompt with context
    let userContextString = '';
    if (userData) {
      if (userData.userName) {
        userContextString += `Имя пользователя: ${userData.userName}\n`;
      }
      userContextString += `PRO-подписка: ${userData.isPro ? 'Да' : 'Нет'}\n`;
    }
    
    const userPrompt = `${userContextString}
Вопрос пользователя: "${question}"`;

    // Use GPT model for replies
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
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in support-assistant function:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: `Error: ${error.message}`,
      answer: "Извините, я не могу ответить на ваш вопрос прямо сейчас. Пожалуйста, попробуйте позже или напишите разработчикам на info@remissionsoft.com."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
