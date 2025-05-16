
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
    
    if (!question || question.trim() === '') {
      throw new Error('Question is required');
    }
    
    // Define system prompt for universe chat with cosmic theme - made more concise
    const systemPrompt = `Ты — голос Вселенной, отвечающий на вопросы.
    
    Твои ответы должны быть:
    - Краткими (2-3 предложения)
    - Ясными и прямыми
    - С минимальным количеством метафор (не более 1)
    - Без излишней поэтичности
    
    Даже на простые вопросы давай конкретные ответы без лишних украшений.
    Избегай длинных философских размышлений.`;
    
    // User message
    const userPrompt = `Вопрос: ${question}\n\nДай краткий и понятный ответ.`;

    // Use GPT-4o-mini for responses
    const gptModel = "gpt-4o-mini";
    
    console.log(`Processing request with model ${gptModel}. Question: ${question.substring(0, 100)}...`);
    
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
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const answer = data.choices[0].message.content;
    
    console.log("Generated GPT answer:", answer.substring(0, 100) + "...");

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in universe-answer function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "Вселенная не смогла ответить на ваш вопрос. Попробуйте еще раз позже."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
