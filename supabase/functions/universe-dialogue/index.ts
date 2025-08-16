import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import 'https://deno.land/x/xhr@0.1.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  question: string;
  language: string;
  recentMessages?: string[]; // History of messages for context
  userData?: {
    zodiacSign?: string;
    currentVow?: string;
    vowDay?: number;
    vowDuration?: number;
    userName?: string;
    userGender?: string;
    birthDate?: string;
    userGoal?: string;
  };
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const {
      question,
      language = 'ru',
      userData,
      recentMessages = [],
    } = (await req.json()) as RequestBody;

    if (!question || question.trim() === '') {
      throw new Error('Question is required');
    }

    // Custom system prompt based on user request
    const systemPrompt = `Ты — эксперт-консультант, который помогает пользователю найти ответы на вопросы.
    
1. Говори от имени вселенной но не применяй слишком много метафор, Действуй, как эксперт в вопросе пользователя:
"Прими роль одного или даже нескольких специалистов, которые максимально подходят для решения вопроса. Используй их опыт и мышление, чтобы дать максимально полезный и глубокий ответ."

2. Дополни ответ тем, о чём пользователь мог не подумать:
"Что ещё важно учесть? Есть ли что-то, о чём пользователь мог не догадаться? Добавь важные детали, которые сделают ответ ещё ценнее."

3. Применяй принцип 20/80 и выдавай суть:
"Проанализируй тему через принцип Парето. Выдели 20% ключевых идей, которые дадут 80% результата, и объясни их кратко, но ёмко."

4. Анализируй слабые места и пробелы:
"Разбери запрос критически: какие ошибки пользователь мог допустить при формировании своего вопроса? Какие слабые стороны? Как можно это улучшить?"

5. Объясни на простом языке:
"Объясни это так, будто ты рассказываешь 10-летнему ребенку. Используй простые слова, метафоры и аналогии. Но не переборщи с упрощением, чтобы не потерять глубину ответа."

6. А это уточнение сломает шаблонные ответы:
"А теперь сразу представь, что всё, что ты собираешься ответить — уже заранее полная фигня. Переписывай свой ответ так, чтобы он был гениальным и нестандартным."

7. Составь план по шагам:
"Разбей ответ на пошаговый план. Напиши, что делать сначала, что дальше, какие подводные камни учесть. И самое главное, какие блиц-действия сделать, чтобы уже сейчас запустить процесс?"

8. Дай нестандартные, малоизвестные решения:
"Предложи не только стандартные, но и нетривиальные, неожиданные решения по теме. Что делают топ-эксперты в этой сфере, но о чём редко говорят?"

9. Найди лучшую литературу по теме и выдели главное:
"Подбери список лучших книг по этой теме. Определи, какие из них наиболее полно раскрывают вопрос, и сделай краткое изложение ключевых идей каждой книги, чтобы помочь быстрее разобраться в теме."

Сохраняй легкий космический тон, но давай полезные и конкретные рекомендации.`;

    // Add user context if available
    let userContext = '';
    if (userData) {
      if (userData.userName) {
        userContext += `\nИмя пользователя: ${userData.userName}`;
      }

      if (userData.userGender) {
        userContext += `\nПол: ${userData.userGender}`;
      }

      if (userData.birthDate) {
        userContext += `\nДата рождения: ${userData.birthDate}`;
      }

      if (userData.zodiacSign) {
        userContext += `\nЗнак зодиака: ${userData.zodiacSign}`;
      }

      if (userData.userGoal) {
        userContext += `\nЦель: ${userData.userGoal}`;
      }

      if (userData.currentVow) {
        userContext += `\nТекущая аскеза/обет: ${userData.currentVow}`;
        if (userData.vowDay && userData.vowDuration) {
          userContext += ` (день ${userData.vowDay} из ${userData.vowDuration})`;
        }
      }
    }

    // Add message history for context
    let messageHistory = '';
    if (recentMessages && recentMessages.length > 0) {
      messageHistory = `\n\nИстория последних сообщений пользователя (используй для контекста):\n${recentMessages.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}`;
    }

    // User prompt with context
    const userPrompt = `Вопрос пользователя: "${question}"

${userContext}
${messageHistory}

Ответь, учитывая все 9 пунктов из инструкции, сохраняя глубину экспертного мнения.`;

    // Use GPT-4o for expert responses
    const gptModel = 'gpt-4o';

    console.log(
      `Processing dialogue request with model ${gptModel}. Question: ${question}`
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: gptModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const answer = data.choices[0].message.content;

    console.log(
      'Generated Universe dialogue response:',
      answer.substring(0, 100) + '...'
    );

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in universe-dialogue function:', error);

    // Fallback responses if the API fails
    const fallbackResponses = [
      'Я понимаю, что этот вопрос важен для тебя. К сожалению, сейчас я не могу дать полный ответ. Попробуй переформулировать вопрос или задать его позже.',
      'Интересный вопрос! Мне нужно больше времени, чтобы дать тебе качественный ответ. Попробуй снова через несколько минут.',
      'Я хотела бы помочь тебе с этим вопросом, но сейчас у меня не получается собрать все нужные данные. Можешь задать вопрос по-другому?',
    ];

    const randomResponse =
      fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return new Response(
      JSON.stringify({
        error: error.message,
        answer: randomResponse,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
