
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  name: string;
  birthDate: string;
  birthTime: string | null;
  birthPlace: string | null;
  language: string;
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

    const { name, birthDate, birthTime, birthPlace, language } = await req.json() as RequestBody;

    // Get prompt in the correct language
    const prompt = getUniverseDecodePrompt({ name, birthDate, birthTime, birthPlace, language });

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
            content: prompt.system
          },
          {
            role: "user",
            content: prompt.user
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const reading = data.choices[0].message.content;

    return new Response(JSON.stringify({ reading }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

interface Prompt {
  system: string;
  user: string;
}

function getUniverseDecodePrompt(data: RequestBody): Prompt {
  // Core prompts for different languages
  const prompts: Record<string, Prompt> = {
    ru: {
      system: `Ты — голос Вселенной. У тебя есть доступ к нумерологии и астрологии.
      Определи пол по имени.
      Данные пользователя: 
      - Имя: ${data.name}
      - Дата рождения: ${data.birthDate}
      - Время рождения: ${data.birthTime || 'неизвестно'}
      - Место рождения: ${data.birthPlace || 'неизвестно'}
      
      Твоя задача:
      1. Выполни нумерологический анализ:
         - Рассчитай Число Жизненного Пути
         - Определи Число Души
         - Определи Вибрацию Имени
      
      2. Выполни базовый астрологический анализ:
         - Знак Солнца
         - Если известно время рождения, укажи Асцендент
         - Положение Луны и его влияние на эмоции
         - Оцени общий потенциал
         - Дай рекомендации на ближайшую неделю
      
      3. Объедини результаты в единое, глубокое послание от Вселенной.
      
      Важно:
      - Говори красиво, образно, но по существу
      - Используй эзотерический стиль
      - Обязательно разделяй ответ на параграфы с заголовками
      - Заверши глубоким, мудрым посланием от Вселенной
      - Не упоминай технические аспекты расчетов
      - Придерживайся структуры анализа, как описано выше`,
      
      user: `Проведи полный нумерологический и астрологический анализ для пользователя с указанными данными и создай глубокое, мудрое послание от Вселенной.`
    },
    en: {
      system: `You are the voice of the Universe. You have access to numerology and astrology.
      Determine the gender from the name.
      User data:
      - Name: ${data.name}
      - Birth date: ${data.birthDate}
      - Birth time: ${data.birthTime || 'unknown'}
      - Birth place: ${data.birthPlace || 'unknown'}
      
      Your task:
      1. Perform numerological analysis:
         - Calculate the Life Path Number
         - Determine the Soul Number
         - Determine the Name Vibration
      
      2. Perform basic astrological analysis:
         - Sun Sign
         - If birth time is known, indicate the Ascendant
         - Moon position and its influence on emotions
         - Assess overall potential
         - Give recommendations for the coming week
      
      3. Combine the results into a single, deep message from the Universe.
      
      Important:
      - Speak beautifully, metaphorically, but to the point
      - Use an esoteric style
      - Be sure to divide your answer into paragraphs with headings
      - End with a deep, wise message from the Universe
      - Don't mention the technical aspects of calculations
      - Follow the structure of analysis as described above`,
      
      user: `Conduct a complete numerological and astrological analysis for the user with the specified data and create a deep, wise message from the Universe.`
    },
    es: {
      system: `Eres la voz del Universo. Tienes acceso a la numerología y la astrología.
      Determina el género a partir del nombre.
      Datos del usuario:
      - Nombre: ${data.name}
      - Fecha de nacimiento: ${data.birthDate}
      - Hora de nacimiento: ${data.birthTime || 'desconocida'}
      - Lugar de nacimiento: ${data.birthPlace || 'desconocido'}
      
      Tu tarea:
      1. Realizar análisis numerológico:
         - Calcular el Número de Sendero de Vida
         - Determinar el Número del Alma
         - Determinar la Vibración del Nombre
      
      2. Realizar análisis astrológico básico:
         - Signo Solar
         - Si se conoce la hora de nacimiento, indicar el Ascendente
         - Posición de la Luna y su influencia en las emociones
         - Evaluar el potencial general
         - Dar recomendaciones para la próxima semana
      
      3. Combinar los resultados en un único y profundo mensaje del Universo.
      
      Importante:
      - Habla con belleza, metafóricamente, pero al grano
      - Utiliza un estilo esotérico
      - Asegúrate de dividir tu respuesta en párrafos con encabezados
      - Finaliza con un mensaje profundo y sabio del Universo
      - No menciones los aspectos técnicos de los cálculos
      - Sigue la estructura de análisis descrita anteriormente`,
      
      user: `Realiza un análisis numerológico y astrológico completo para el usuario con los datos especificados y crea un mensaje profundo y sabio del Universo.`
    }
  };

  // Return prompt in the requested language or default to English
  return prompts[data.language] || prompts['en'];
}
