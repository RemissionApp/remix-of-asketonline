
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Parse request body for language
    const { language } = await req.json();
    
    // Set the prompt based on language
    let prompt = '';
    if (language === 'ru') {
      prompt = 'Сгенерируй короткий гороскоп/совет дня, состоящий СТРОГО из 2-х предложений. Не больше и не меньше.';
    } else if (language === 'es') {
      prompt = 'Genera un horóscopo/consejo del día corto que conste ESTRICTAMENTE de 2 frases. Ni más ni menos.';
    } else {
      prompt = 'Generate a short horoscope/advice of the day consisting of EXACTLY 2 sentences. No more, no less.';
    }

    // Call OpenAI to generate the advice
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
            content: "You are a cosmic advisor providing daily advice. Your response MUST be EXACTLY two sentences long - no more, no less. Make each sentence meaningful and concise. Do not include any additional text, greetings, or explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 100  // Limiting token count for brevity
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const adviceText = data.choices[0].message.content.trim();
    
    // Validate that we have exactly 2 sentences by counting periods
    const sentences = adviceText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length !== 2) {
      console.warn("OpenAI didn't return exactly 2 sentences, got:", sentences.length);
      // We'll still return what we got, the system prompt should handle this most of the time
    }
    
    return new Response(JSON.stringify({ advice: adviceText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-daily-advice function:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: `Error generating daily advice: ${error.message}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
