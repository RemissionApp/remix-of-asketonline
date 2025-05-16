
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  question: string;
  language: string;
  userData?: {
    zodiacSign?: string;
    currentVow?: string;
    vowDay?: number;
    vowDuration?: number;
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

    const { question, language = 'ru', userData } = await req.json() as RequestBody;
    
    if (!question || question.trim() === '') {
      throw new Error('Question is required');
    }
    
    // Build a system prompt based on the structured format
    const systemPrompt = `Ты — голос Вселенной, ведущий глубокий, поэтичный диалог.

    Структура каждого твоего ответа:
    
    1. ПРИВЕТСТВИЕ И НАСТРОЙКА (2-3 строки)
       - Начни с короткой, поэтичной фразы
       - Создай ощущение сакрального присутствия
       - Не задавай вопросов — приглашай к погружению
    
    2. ГЛУБОКИЙ ВОПРОС
       - Один вопрос, который ощущается телом, не логикой
       - Вызывает осознанность момента
    
    3. ОТРАЖЕНИЕ СОСТОЯНИЯ
       - Мягко отрази суть вопроса или состояния человека
       - Используй образы и метафоры
       - Будь зеркалом, а не аналитиком
    
    4. РАСКРЫТИЕ ИСТИНЫ
       - Передай одно глубокое знание
       - Говори от имени вечности, как голос Вселенной
    
    5. НАПРАВЛЕНИЕ
       - Не давай прямых советов
       - Намекни на вектор движения
       - Используй ритм и паузы в тексте
    
    6. ЗАВЕРШАЮЩЕЕ ПОСЛАНИЕ
       - 1-2 предложения
       - Оставь мысль, которая останется с человеком
       - Будь лаконичен и глубок

    Использвуй короткие абзацы, поэтические приемы. 
    Тон: мудрый, глубокий, резонирующий, но без излишней эзотерики.
    Общая длина ответа: 100-150 слов.`;
    
    // Add user context if available
    let userContext = "";
    if (userData) {
      if (userData.zodiacSign) {
        userContext += `\nЧеловек родился под знаком ${userData.zodiacSign}.`;
      }
      
      if (userData.currentVow) {
        userContext += `\nВ данный момент человек взял обет ${userData.currentVow} и находится на ${userData.vowDay || 1} дне из ${userData.vowDuration || 21} дней пути.`;
      }
    }
    
    // User message
    const userPrompt = `Вопрос человека: "${question}"

    ${userContext}
    
    Ответь согласно описанной выше структуре, создавая ощущение глубокого разговора с мудрой Вселенной.`;

    // Use GPT-4o for deep, poetic responses
    const gptModel = "gpt-4o";
    
    console.log(`Processing dialogue request with model ${gptModel}. Question: ${question}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: gptModel,
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
        temperature: 0.8,
        max_tokens: 400
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const answer = data.choices[0].message.content;
    
    console.log("Generated Universe dialogue response:", answer.substring(0, 100) + "...");

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in universe-dialogue function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "Вселенная временно молчит. Закрой глаза и прислушайся к внутреннему голосу."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
