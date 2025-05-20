
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
      prompt = 'Сгенерируй пользователю гороскоп/совет дня состоящий из 2х предложений';
    } else if (language === 'es') {
      prompt = 'Genera un horóscopo/consejo del día para el usuario que conste de 2 frases';
    } else {
      prompt = 'Generate a horoscope/advice of the day for the user consisting of 2 sentences';
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
            content: "You are a wise cosmic advisor providing brief, insightful daily advice. Keep your response poetic, meaningful, and exactly two sentences long."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const adviceText = data.choices[0].message.content.trim();
    
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
