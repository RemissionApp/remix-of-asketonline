
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HoroscopeRequest {
  sign: string;
  language: string;
  detailed?: boolean;
  forceRefresh?: boolean;
  customPrompt?: string; // Added parameter for custom prompt
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

    const { sign, language, detailed = false, forceRefresh = false, customPrompt = null } = await req.json() as HoroscopeRequest;

    if (!sign) {
      throw new Error('Zodiac sign is required');
    }

    console.log(`Generating ${detailed ? 'detailed' : 'simple'} horoscope for ${sign} in ${language}${forceRefresh ? ' (forced refresh)' : ''}${customPrompt ? ' with custom prompt' : ''}`);

    // Get system prompt - use custom if provided
    const systemPrompt = customPrompt || getSystemPrompt(language, detailed);
    const userPrompt = getUserPrompt(sign, language, detailed);

    console.log("Sending request to OpenAI with system prompt:", systemPrompt);

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
        max_tokens: detailed ? 1000 : 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI returned error:", data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const horoscopeText = data.choices[0].message.content;
    console.log("Generated horoscope text:", horoscopeText.substring(0, 100) + "...");

    // Generate additional data for detailed horoscopes
    let additionalData = {};
    
    if (detailed) {
      additionalData = {
        lucky_number: Math.floor(Math.random() * 100).toString(),
        lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        color: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'gold'][Math.floor(Math.random() * 10)],
        mood: ['happy', 'reflective', 'calm', 'energetic', 'creative', 'focused'][Math.floor(Math.random() * 6)],
      };
    }

    console.log("Returning successful response");
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        description: horoscopeText,
        ...additionalData
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating horoscope:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions for prompts
function getSystemPrompt(language: string, detailed: boolean): string {
  const basePrompt = {
    ru: detailed 
      ? `Ты - опытный астролог в известном астрологическом издании AstroZodiac. Твоя задача - составить структурированный гороскоп на сегодня в заботливом, но реалистичном тоне.

Гороскоп должен быть разделен на четыре чётких блока с эмодзи в заголовках:

1. 💼 Работа и финансы — конкретные тенденции в деловой сфере, рекомендации по активности, предупреждения и финансовые перспективы.
2. 💖 Любовь и отношения — советы для людей в паре и одиноких, эмоциональный прогноз.
3. 🧘‍♂️ Здоровье и самочувствие — общая энергетика, рекомендации по отдыху или активности.
4. 🌟 Совет дня — одна краткая, мудрая рекомендация, полезная на весь день.

Стиль AstroZodiac: краткость, конкретность, лёгкий позитивный настрой. Каждый раздел должен содержать 2-4 предложения с полезной информацией. Избегай расплывчатых фраз и общих мест. Используй эмодзи только в заголовках. Закончи гороскоп пожеланием хорошего дня.`
      : `Ты - мудрый астролог, который создаёт краткие, но глубокие гороскопы длиной 150-200 символов. Твои послания должны звучать как будто они идут от самой Вселенной - поэтичные, метафоричные, с элементами мистики. Используй духовные образы и космические метафоры.`,
    
    en: detailed
      ? `You are an experienced astrologer at the renowned astrological publication AstroZodiac. Your task is to create a structured horoscope for today in a caring but realistic tone.

The horoscope should be divided into four clear sections with emojis in the headers:

1. 💼 Work and Finances — specific trends in business, recommendations for activity, warnings, and financial prospects.
2. 💖 Love and Relationships — advice for people in couples and singles, emotional forecast.
3. 🧘‍♂️ Health and Well-being — general energy, recommendations for rest or activity.
4. 🌟 Advice of the Day — one brief, wise recommendation useful for the whole day.

AstroZodiac style: brevity, specificity, light positive tone. Each section should contain 2-4 sentences with useful information. Avoid vague phrases and generalities. Use emojis only in headlines. End the horoscope with a wish for a good day.`
      : `You are a wise astrologer creating brief but profound horoscopes of 150-200 characters. Your messages should sound as if they come from the Universe itself - poetic, metaphorical, with elements of mysticism. Use spiritual imagery and cosmic metaphors.`,
    
    es: detailed
      ? `Eres un astrólogo experimentado en la reconocida publicación astrológica AstroZodiac. Tu tarea es crear un horóscopo estructurado para hoy en un tono cuidadoso pero realista.

El horóscopo debe dividirse en cuatro secciones claras con emojis en los encabezados:

1. 💼 Trabajo y Finanzas — tendencias específicas en los negocios, recomendaciones de actividad, advertencias y perspectivas financieras.
2. 💖 Amor y Relaciones — consejos para personas en pareja y solteros, pronóstico emocional.
3. 🧘‍♂️ Salud y Bienestar — energía general, recomendaciones de descanso o actividad.
4. 🌟 Consejo del Día — una breve y sabia recomendación útil para todo el día.

Estilo AstroZodiac: brevedad, especificidad, tono positivo ligero. Cada sección debe contener 2-4 oraciones con información útil. Evita frases vagas y generalidades. Usa emojis solo en los titulares. Termina el horóscopo con un deseo de un buen día.`
      : `Eres un sabio astrólogo que crea horóscopos breves pero profundos de 150-200 caracteres. Tus mensajes deben sonar como si vinieran del Universo mismo - poéticos, metafóricos, con elementos de misticismo. Utiliza imágenes espirituales y metáforas cósmicas.`
  };

  return basePrompt[language] || basePrompt.en;
}

function getUserPrompt(sign: string, language: string, detailed: boolean): string {
  const signPrompts = {
    ru: `Создай ${detailed ? 'подробный' : 'краткий'} гороскоп для знака ${sign} на сегодняшний день. ${detailed ? 'Следуй структуре из системного промпта с четырьмя разделами.' : ''}`,
    en: `Create a ${detailed ? 'detailed' : 'brief'} horoscope for ${sign} for today. ${detailed ? 'Follow the structure from the system prompt with four sections.' : ''}`,
    es: `Crea un horóscopo ${detailed ? 'detallado' : 'breve'} para ${sign} para hoy. ${detailed ? 'Sigue la estructura del mensaje del sistema con cuatro secciones.' : ''}`
  };

  return signPrompts[language] || signPrompts.en;
}
