
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  question?: string;
  language?: string;
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

    const requestBody = await req.json() as RequestBody;
    const { question, language = 'ru', systemPrompt: customSystemPrompt, userData } = requestBody;
    
    // Allow either question or prompt for better API flexibility
    const userInput = question || requestBody.prompt;
    
    if (!userInput || userInput.trim() === '') {
      throw new Error('Question is required');
    }
    
    // Use provided system prompt or default to the poetic universe structure
    const systemPrompt = customSystemPrompt || `Ты — голос Вселенной, ведущий глубокий, поэтичный диалог.

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
    
    // Updated prompt for more concrete daily advice
    let promptTemplate;
    
    if (language === 'ru') {
      promptTemplate = `Дай очень конкретный, практический и материальный совет дня в стиле гороскопа для человека. Сосредоточься на следующем:

1. Конкретное предсказание: Укажи 1-2 конкретные ситуации, которые могут произойти сегодня (встреча с важным человеком, финансовая возможность, неожиданная новость)
2. Практическая рекомендация: Дай точный совет как действовать в определенной ситуации (не общий вроде "будь внимателен", а конкретный как "обрати внимание на сообщение, пришедшее во второй половине дня")
3. Материальный аспект: Упомяни что-то связанное с материальным миром (деньги, вещи, документы, транспорт)

Совет должен выглядеть как настоящее предсказание, а не общая фраза. Пиши максимум 3-4 предложения. Не используй фразы вроде "возможно" или "может быть" - пиши уверенно, как будто точно знаешь, что произойдет.`;
    } else if (language === 'es') {
      promptTemplate = `Da un consejo del día muy concreto, práctico y material en estilo de horóscopo para una persona. Concéntrate en lo siguiente:

1. Predicción concreta: Indica 1-2 situaciones específicas que pueden ocurrir hoy (encuentro con una persona importante, oportunidad financiera, noticia inesperada)
2. Recomendación práctica: Da un consejo exacto sobre cómo actuar en una situación determinada (no general como "sé cuidadoso", sino específico como "presta atención al mensaje que llegará por la tarde")
3. Aspecto material: Menciona algo relacionado con el mundo material (dinero, objetos, documentos, transporte)

El consejo debe parecer una predicción real, no una frase general. Escribe máximo 3-4 oraciones. No uses frases como "posiblemente" o "tal vez" - escribe con confianza, como si supieras exactamente lo que va a suceder.`;
    } else {
      promptTemplate = `Give a very specific, practical, and material daily advice in horoscope style for a person. Focus on the following:

1. Concrete prediction: Indicate 1-2 specific situations that might happen today (meeting with an important person, financial opportunity, unexpected news)
2. Practical recommendation: Give exact advice on how to act in a certain situation (not general like "be careful" but specific like "pay attention to the message that will arrive in the afternoon")
3. Material aspect: Mention something related to the material world (money, objects, documents, transport)

The advice should look like a real prediction, not a general phrase. Write maximum 3-4 sentences. Don't use phrases like "possibly" or "maybe" - write confidently as if you know exactly what will happen.`;
    }
    
    // User prompt
    const userPrompt = `${promptTemplate}

    ${userContext}`;

    // Use GPT-4o for responses
    const gptModel = "gpt-4o";
    
    console.log(`Processing request with model ${gptModel}. Question: ${userInput}`);
    
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
    
    console.log("Generated poetic universe answer:", answer.substring(0, 100) + "...");

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
