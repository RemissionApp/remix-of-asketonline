
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
  birthDate?: string;
}

interface HoroscopeResponse {
  success: boolean;
  data?: {
    description: string;
    sections?: {
      work_finance: string;
      love_relationships: string;
      health_wellbeing: string;
      daily_advice: string;
    };
    lucky_number?: string;
    lucky_time?: string;
    color?: string;
    mood?: string;
  };
  error?: string;
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

    const { sign, language, detailed = false, birthDate = null } = await req.json() as HoroscopeRequest;

    if (!sign) {
      throw new Error('Zodiac sign is required');
    }

    console.log(`Generating ${detailed ? 'detailed' : 'brief'} horoscope for sign: ${sign}, language: ${language}`);

    // Get the appropriate system prompt based on language
    const systemPrompt = getSystemPrompt(language, detailed);
    const userPrompt = getUserPrompt(sign, language, detailed, birthDate);

    console.log(`User prompt: ${userPrompt}`);

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
        max_tokens: detailed ? 800 : 200
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const horoscopeText = data.choices[0].message.content;
    console.log(`Generated horoscope: ${horoscopeText.substring(0, 100)}...`);

    // For detailed horoscopes, parse sections from the response
    let horoscopeResponse: HoroscopeResponse = { success: true };
    
    if (detailed) {
      horoscopeResponse.data = {
        description: horoscopeText,
        sections: {
          work_finance: extractSection(horoscopeText, "работа", "финанс", "work", "finance", "💼"),
          love_relationships: extractSection(horoscopeText, "любовь", "отношения", "love", "relation", "❤️"),
          health_wellbeing: extractSection(horoscopeText, "здоровье", "самочувствие", "health", "wellbeing", "🌿"),
          daily_advice: extractSection(horoscopeText, "совет", "рекомендация", "advice", "tip", "✨")
        },
        lucky_number: Math.floor(Math.random() * 100).toString(),
        lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        color: getRandomColor(language),
        mood: getRandomMood(language)
      };
    } else {
      horoscopeResponse.data = {
        description: horoscopeText
      };
    }

    return new Response(JSON.stringify(horoscopeResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-horoscope API call:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: `Error generating horoscope: ${error.message}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Extract specific section from the horoscope text
function extractSection(text: string, ru1: string, ru2: string, en1: string, en2: string, emoji: string): string {
  // Try to find the section using various patterns
  const patterns = [
    new RegExp(`${emoji}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`[^\\n]*${ru1}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`[^\\n]*${ru2}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`[^\\n]*${en1}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i'),
    new RegExp(`[^\\n]*${en2}[^\\n]*(?:\\n|.)*?(?=\\n\\n|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  
  // If no match found, create a default response based on section indicators
  if (ru1 === "работа" || en1 === "work") {
    return `${emoji} Сегодня благоприятный день для профессиональных начинаний.`;
  } else if (ru1 === "любовь" || en1 === "love") {
    return `${emoji} День подходит для укрепления существующих отношений.`;
  } else if (ru1 === "здоровье" || en1 === "health") {
    return `${emoji} Уделите время своему физическому и эмоциональному благополучию.`;
  } else if (ru1 === "совет" || en1 === "advice") {
    return `${emoji} Практикуйте благодарность и внимательность сегодня.`;
  }
  
  return "";
}

// Helper functions for prompts
function getSystemPrompt(language: string, detailed: boolean): string {
  if (detailed) {
    // System prompts for detailed horoscopes
    const detailedPrompts = {
      ru: `Ты опытный астролог, создающий персонализированные гороскопы. 
      Создай детальный гороскоп на сегодня с разбивкой на 4 блока: 
      
      1. 💼 Работа и финансы - тенденции в деловой сфере, советы по активности, финансовые перспективы.
      2. ❤️ Любовь и отношения - советы для пар и одиноких, эмоциональные аспекты дня.
      3. 🌿 Здоровье и самочувствие - энергетическое состояние, рекомендации по заботе о себе.
      4. ✨ Совет дня - мудрая рекомендация или настрой на день.
      
      Используй заботливый, реалистичный тон. Каждый раздел начинай с соответствующего эмодзи. 
      Пиши кратко, конкретно, с лёгкой позитивной нотой, но без пустых обещаний.`,
      
      en: `You're an experienced astrologer creating personalized horoscopes.
      Create a detailed horoscope for today with 4 distinct sections:
      
      1. 💼 Work and Finance - business trends, activity advice, financial prospects.
      2. ❤️ Love and Relationships - advice for couples and singles, emotional aspects.
      3. 🌿 Health and Wellbeing - energy state, self-care recommendations.
      4. ✨ Daily Advice - wise recommendation or mindset for the day.
      
      Use a caring, realistic tone. Start each section with the corresponding emoji.
      Write concisely and specifically with a light positive note, but without empty promises.`,
      
      es: `Eres un astrólogo experimentado que crea horóscopos personalizados.
      Crea un horóscopo detallado para hoy con 4 secciones distintas:
      
      1. 💼 Trabajo y Finanzas - tendencias comerciales, consejos de actividad, perspectivas financieras.
      2. ❤️ Amor y Relaciones - consejos para parejas y solteros, aspectos emocionales.
      3. 🌿 Salud y Bienestar - estado energético, recomendaciones de autocuidado.
      4. ✨ Consejo del Día - recomendación sabia o mentalidad para el día.
      
      Usa un tono cuidadoso y realista. Comienza cada sección con el emoji correspondiente.
      Escribe de manera concisa y específica con una ligera nota positiva, pero sin promesas vacías.`
    };
    
    return detailedPrompts[language] || detailedPrompts.en;
  } else {
    // Original system prompts for brief horoscopes
    const basePrompt = {
      ru: `Ты - мудрый астролог, который создаёт краткие, но глубокие гороскопы длиной 150-200 символов. Твои послания должны звучать как будто они идут от самой Вселенной - поэтичные, метафоричные, с элементами мистики. Используй духовные образы и космические метафоры.`,
      
      en: `You are a wise astrologer creating brief but profound horoscopes of 150-200 characters. Your messages should sound as if they come from the Universe itself - poetic, metaphorical, with elements of mysticism. Use spiritual imagery and cosmic metaphors.`,
      
      es: `Eres un sabio astrólogo que crea horóscopos breves pero profundos de 150-200 caracteres. Tus mensajes deben sonar como si vinieran del Universo mismo - poéticos, metafóricos, con elementos de misticismo. Utiliza imágenes espirituales y metáforas cósmicas.`
    };
    
    return basePrompt[language] || basePrompt.en;
  }
}

function getUserPrompt(sign: string, language: string, detailed: boolean, birthDate: string | null): string {
  const birthDateInfo = birthDate ? ` (дата рождения: ${birthDate})` : '';
  
  const signPrompts = {
    ru: `Создай ${detailed ? 'подробный' : 'краткий'} гороскоп для знака ${sign}${birthDateInfo} на сегодня.`,
    en: `Create a ${detailed ? 'detailed' : 'brief'} horoscope for ${sign}${birthDateInfo} for today.`,
    es: `Crea un horóscopo ${detailed ? 'detallado' : 'breve'} para ${sign}${birthDateInfo} para hoy.`
  };

  return signPrompts[language] || signPrompts.en;
}

// Helper function to get random color based on language
function getRandomColor(language: string): string {
  const colors = {
    ru: ['красный', 'синий', 'зеленый', 'фиолетовый', 'оранжевый', 'розовый', 'золотой', 'серебряный', 'бирюзовый', 'индиго'],
    en: ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'gold', 'silver', 'turquoise', 'indigo'],
    es: ['rojo', 'azul', 'verde', 'púrpura', 'naranja', 'rosa', 'oro', 'plata', 'turquesa', 'índigo']
  };
  
  const colorList = colors[language] || colors.en;
  return colorList[Math.floor(Math.random() * colorList.length)];
}

// Helper function to get random mood based on language
function getRandomMood(language: string): string {
  const moods = {
    ru: ['радостный', 'задумчивый', 'спокойный', 'энергичный', 'вдохновленный', 'мечтательный', 'созерцательный', 'творческий'],
    en: ['joyful', 'thoughtful', 'peaceful', 'energetic', 'inspired', 'dreamy', 'contemplative', 'creative'],
    es: ['alegre', 'pensativo', 'tranquilo', 'enérgico', 'inspirado', 'soñador', 'contemplativo', 'creativo']
  };
  
  const moodList = moods[language] || moods.en;
  return moodList[Math.floor(Math.random() * moodList.length)];
}
