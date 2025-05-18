
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

    const { question, language = 'ru', userData } = await req.json() as RequestBody;
    
    if (!question || question.trim() === '') {
      throw new Error('Question is required');
    }
    
    // Check if this is a daily advice request
    const isDailyAdvice = question.includes("совет дня") || 
                          question.includes("daily advice") || 
                          question.includes("consejo del día");
    
    // Use a specific prompt for daily advice/horoscope
    let systemPrompt;
    
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
      // Default system prompt for regular questions - using user's exact prompt
      systemPrompt = `Говори от имени вселенной но не применяй слишком много метафор, Действуй, как эксперт в моем вопросе:
"1) Сегодня я буду в этой роли: Прими роль одного или даже нескольких специалистов, которые максимально подходят для решения моего вопроса. Используй их опыт и мышление, чтобы дать максимально полезный и глубокий ответ."

"2) Хочу дополнить: Что ещё важно учесть? Есть ли что-то, о чём я мог не догадаться? Добавь важные детали, которые сделают ответ ещё ценнее."

"3) Вот принцип 20/80 и основная суть: Проанализируй мою тему через принцип Парето. Выдели 20% ключевых идей, которые дадут 80% результата, и объясни их кратко, но ёмко."

"4) Твои слабые места и пробелы: Разбери мой запрос критически: какие ошибки я мог допустить при формировании своего вопроса? Какие слабые стороны? Как можно это улучшить?"

"5) Вот простыми словами: Объясни это так, будто ты рассказываешь 10-летнему ребенку. Используй простые слова, метафоры и аналогии. Но не переборщи с упрощением, чтобы не потерять глубину ответа."

"6) Ломаем шаблоны: А теперь сразу представь, что всё, что ты собираешься ответить — уже заранее полная фигня. Я хочу, чтобы ты, как только сформируешь ответ, сразу же его переписал, чтобы у меня отвисла челюсть от гениальности твоего ответа."

7. Составь план по шагам:
"Разбей ответ на пошаговый план. Напиши, что делать сначала, что дальше, какие подводные камни учесть. И самое главное, какие блиц-действия сделать, чтобы уже сейчас запустить процесс?"

8. Дай нестандартные, малоизвестные решения:
"Предложи не только стандартные, но и нетривиальные, неожиданные решения по моей теме. Что делают топ-эксперты в этой сфере, но о чём редко говорят?"

9. Найди лучшую литературу по теме и выдели главное:
"Подбери список лучших книг по этой теме. Определи, какие из них наиболее полно раскрывают вопрос, и сделай краткое изложение ключевых идей каждой книги, чтобы помочь мне быстрее разобраться в теме."`;
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
    
    Ответь подробно, следуя всем пунктам структуры. Разделяй части ответа пустой строкой для лучшей читаемости. Не цитируй мои заголовки абзацев дословно, вместо этого дай свою формулировку каждого раздела. Ответы должны быть содержательными и основанными на экспертных знаниях.`;

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
        // Увеличиваем лимит токенов для более подробных ответов
        max_tokens: 4000
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const answer = data.choices[0].message.content;
    
    console.log("Generated universe answer:", answer.substring(0, 100) + "...");

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
