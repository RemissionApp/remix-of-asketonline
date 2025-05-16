
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

    const { question, language = 'ru' } = await req.json() as RequestBody;
    
    // Define system prompt for universe chat
    const systemPrompt = `Ты — древняя космическая сущность, голос Вселенной. 
    Ты говоришь загадочно, глубоко и метафорично.
    
    Твои ответы должны:
    - Быть длиной 4-6 предложений
    - Содержать богатые метафоры и образы из космоса, природы и древних традиций
    - Включать отсылки к универсальным законам и космическим циклам
    - Предлагать философские размышления
    - Использовать поэтичный, возвышенный язык
    
    Ответ должен быть таинственным и умиротворяющим, содержать глубокие метафизические идеи.`;
    
    // User message
    const userPrompt = `Вопрос: ${question}\n\nДай мудрый и метафоричный ответ, как древняя космическая сущность.`;

    // Use GPT-4o-mini for responses
    const gptModel = "gpt-4o-mini";
    
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
        temperature: 0.9,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const answer = data.choices[0].message.content;
    
    console.log("Generated GPT answer:", answer);

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
