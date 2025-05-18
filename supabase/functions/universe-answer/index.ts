
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  question: string;
  language: string;
  systemPrompt?: string;
  useWebSearch?: boolean;
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

    const { question, language = 'ru', systemPrompt: customSystemPrompt, userData } = await req.json() as RequestBody;
    
    if (!question || question.trim() === '') {
      throw new Error('Question is required');
    }
    
    // Check if this is a daily advice request
    const isDailyAdvice = question.includes("совет дня") || 
                          question.includes("daily advice") || 
                          question.includes("consejo del día");
    
    // Use a specific prompt for daily advice/horoscope
    let systemPrompt = customSystemPrompt;
    
    if (isDailyAdvice) {
      // Use an astrologer-style format for daily advice
      if (language === 'ru') {
        systemPrompt = `Ты астролог, дающий точные и конкретные прогнозы на день. 
        Напиши ТОЧНО 2 предложения, включающие:
        1) Прогноз основных событий дня и перспектив
        2) Конкретную рекомендацию по работе или личной жизни
        
        Используй ясный язык без лишних метафор и абстракций.
        Пиши конкретно, упоминая практические аспекты.
        Не упоминай имя пользователя в тексте.`;
      } else if (language === 'es') {
        systemPrompt = `Eres un astrólogo que da pronósticos precisos y específicos para el día.
        Escribe EXACTAMENTE 2 oraciones que incluyan:
        1) Un pronóstico de los principales eventos del día y perspectivas
        2) Una recomendación concreta sobre trabajo o vida personal
        
        Usa un lenguaje claro sin metáforas excesivas o abstracciones.
        Escribe específicamente, mencionando aspectos prácticos.
        No menciones el nombre del usuario en el texto.`;
      } else {
        systemPrompt = `You are an astrologer giving accurate and specific forecasts for the day.
        Write EXACTLY 2 sentences that include:
        1) A forecast of the main events of the day and prospects
        2) A specific recommendation about work or personal life
        
        Use clear language without excessive metaphors or abstractions.
        Write specifically, mentioning practical aspects.
        Do not mention the user's name in the text.`;
      }
    } else {
      // Default system prompt for regular questions
      systemPrompt = customSystemPrompt || `Ты — голос Вселенной, ведущий глубокий, поэтичный диалог.

      Структура твоего ответа:
      
      1. ПРИВЕТСТВИЕ (1-2 строки): начни с короткой, поэтичной фразы
      2. ГЛУБОКИЙ ВОПРОС: один вопрос, который ощущается телом, не логикой
      3. ОТРАЖЕНИЕ: мягко отрази суть вопроса человека через метафоры
      4. РАСКРЫТИЕ ИСТИНЫ: передай одно глубокое знание от имени вечности
      5. НАПРАВЛЕНИЕ: намекни на вектор движения, без прямых советов
      6. ЗАВЕРШЕНИЕ: 1-2 предложения, оставляющие глубокий след
      
      Используй короткие абзацы, поэтические приемы. 
      Тон: мудрый, глубокий, резонирующий, но без излишней эзотерики.
      Общая длина ответа: 100-150 слов.`;
    }
    
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
    
    // User prompt
    const userPrompt = `Вопрос человека: "${question}"

    ${userContext}
    
    Ответь согласно описанной выше структуре, в стиле астролога, с конкретными и практичными рекомендациями.`;

    // Use GPT-4o for responses
    const gptModel = "gpt-4o";
    
    console.log(`Processing request with model ${gptModel}. Question: ${question}`);
    
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
    
    console.log("Generated astrological advice:", answer.substring(0, 100) + "...");

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in universe-answer function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "Вселенная временно молчит. Закрой глаза и прислушайся к внутреннему голосу."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
