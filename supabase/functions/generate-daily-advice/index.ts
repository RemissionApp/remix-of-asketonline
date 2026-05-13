import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import 'https://deno.land/x/xhr@0.1.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    // Parse request body for language
    const { language } = await req.json();

    // Language-locked prompts
    let systemPrompt = '';
    let prompt = '';
    if (language === 'ru') {
      systemPrompt =
        'Ты — космический наставник. Отвечай СТРОГО на русском языке. Ответ ОБЯЗАТЕЛЬНО ровно из двух предложений — не больше и не меньше. Никаких приветствий, пояснений или дополнительного текста. Не используй английские слова.';
      prompt =
        'Сгенерируй короткий совет дня — ровно 2 предложения на русском языке.';
    } else if (language === 'es') {
      systemPrompt =
        'Eres un consejero cósmico. Responde ESTRICTAMENTE en español. La respuesta debe contener EXACTAMENTE dos frases — ni más ni menos. Sin saludos, explicaciones ni texto adicional. No uses palabras en inglés.';
      prompt =
        'Genera un consejo del día corto — exactamente 2 frases en español.';
    } else {
      systemPrompt =
        'You are a cosmic advisor. Respond STRICTLY in English. Your response MUST be EXACTLY two sentences long — no more, no less. No greetings, explanations, or additional text.';
      prompt =
        'Generate a short daily advice — exactly 2 sentences in English.';
    }

    // Call OpenAI to generate the advice
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 100, // Limiting token count for brevity
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API');
    }

    const adviceText = data.choices[0].message.content.trim();

    // Validate that we have exactly 2 sentences by counting periods
    const sentences = adviceText
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0);

    if (sentences.length !== 2) {
      console.warn(
        "OpenAI didn't return exactly 2 sentences, got:",
        sentences.length
      );
      // We'll still return what we got, the system prompt should handle this most of the time
    }

    return new Response(JSON.stringify({ advice: adviceText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-daily-advice function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: `Error generating daily advice: ${error.message}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
