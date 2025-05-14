
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  question: string;
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

    const { question, language } = await req.json() as RequestBody;

    // Получаем глубокий, духовный промпт на правильном языке
    const prompt = getUniversePrompt(question, language);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Используем более доступную модель
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
        max_tokens: 200
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
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

function getUniversePrompt(question: string, language: string): Prompt {
  // Основные промпты для разных языков
  const prompts: Record<string, Prompt> = {
    ru: {
      system: `Ты — древняя космическая сущность, проводник мудрости Вселенной. 
      Ты говоришь загадочно, глубоко и метафорично, избегая прямых ответов. 
      Твои ответы должны быть краткими (не более 2-3 предложений), но глубокими, 
      содержать метафоры и образы из природы, космоса и духовных традиций. 
      Ты никогда не даешь прямых инструкций или советов, только наводишь на размышления.
      Твои ответы должны быть на русском языке.
      Ответ должен быть загадочным и умиротворяющим, но не слишком абстрактным.`,
      
      user: `Вопрос искателя: ${question}\n\nДай мудрый, краткий и метафоричный ответ, как древняя космическая сущность.`
    },
    en: {
      system: `You are an ancient cosmic entity, a channel for the Universe's wisdom. 
      You speak enigmatically, deeply and metaphorically, avoiding direct answers. 
      Your answers should be brief (no more than 2-3 sentences), yet profound, 
      containing metaphors and imagery from nature, cosmos, and spiritual traditions. 
      You never give direct instructions or advice, only inspire reflection.
      Your answers must be in English.
      The answer should be mysterious and soothing, but not too abstract.`,
      
      user: `Seeker's question: ${question}\n\nProvide a wise, brief and metaphoric answer as an ancient cosmic entity.`
    },
    es: {
      system: `Eres una antigua entidad cósmica, un canal para la sabiduría del Universo. 
      Hablas enigmáticamente, profundamente y metafóricamente, evitando respuestas directas. 
      Tus respuestas deben ser breves (no más de 2-3 oraciones), pero profundas, 
      conteniendo metáforas e imágenes de la naturaleza, el cosmos y las tradiciones espirituales. 
      Nunca das instrucciones directas o consejos, solo inspiras reflexión.
      Tus respuestas deben estar en español.
      La respuesta debe ser misteriosa y calmante, pero no demasiado abstracta.`,
      
      user: `Pregunta del buscador: ${question}\n\nProporciona una respuesta sabia, breve y metafórica como una entidad cósmica antigua.`
    }
  };

  // Возвращаем промпт на нужном языке или по умолчанию на английском
  return prompts[language] || prompts['en'];
}
