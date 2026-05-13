import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''));
    if (claimsErr || !claimsData?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      text,
      voice = 'Custom',
      model = 'eleven_turbo_v2',
    } = await req.json();

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (text.length > 5000) {
      return new Response(JSON.stringify({ error: 'Text too long (max 5000 chars)' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      throw new Error('Eleven Labs API key not configured');
    }

    // Voice ID mapping for popular voices
    const voiceIds: Record<string, string> = {
      Custom: 'Atp5cNFg1Wj5gyKD7HWV', // Updated custom voice ID
      Aria: '9BWtsMINqrJLrRacOk9x',
      Sarah: 'EXAVITQu4vr4xnSDxMaL',
      Laura: 'FGY2WhTYpPnrIDTdsKH5',
      Charlie: 'IKne3meq5aSn9XLyUdCD',
      Charlotte: 'XB0fDUnXU5powFXDhCwa',
      Alice: 'Xb7hH8MSUJpSbSDYk0k2',
    };

    const voiceId = voiceIds[voice] || voiceIds['Custom'];

    console.log(
      'Generating speech with Eleven Labs for text:',
      text.substring(0, 50) + '...'
    );
    console.log('Using voice ID:', voiceId);

    // Generate speech using Eleven Labs API with enhanced voice settings
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.75, // Увеличена стабильность для более последовательного звучания
            similarity_boost: 0.85, // Увеличено сходство с оригинальным голосом
            style: 0.35, // Добавлен стиль для более выразительной речи
            use_speaker_boost: true, // Включено улучшение динамика
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Eleven Labs API error:', response.status, errorText);

      // Graceful degradation: 401 from ElevenLabs (free tier blocked, invalid key,
      // unusual activity) should NOT crash the client. Return a structured 503
      // so callers can show a friendly toast and skip audio.
      // Graceful degradation: never throw 5xx for upstream provider issues.
      // supabase.functions.invoke treats non-2xx as `error` and discards the
      // body, so the client cannot read `available: false`. Always return 200
      // with a structured payload — the client checks `data.available`.
      return new Response(
        JSON.stringify({
          available: false,
          error: 'tts_unavailable',
          status: response.status,
          message:
            'Голосовое озвучивание временно недоступно. Попробуйте позже.',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Eleven Labs API response successful, processing audio...');

    // Get audio as array buffer
    const arrayBuffer = await response.arrayBuffer();
    console.log('Audio buffer size:', arrayBuffer.byteLength);

    // Convert to base64 efficiently
    const uint8Array = new Uint8Array(arrayBuffer);
    const binaryString = Array.from(uint8Array, byte =>
      String.fromCharCode(byte)
    ).join('');
    const base64Audio = btoa(binaryString);

    console.log(
      'Successfully generated speech audio, base64 length:',
      base64Audio.length
    );

    return new Response(
      JSON.stringify({
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error.message);
    // Return 200 with available:false so the client degrades gracefully
    // instead of surfacing a 5xx as a hard error / blank screen.
    return new Response(
      JSON.stringify({
        available: false,
        error: 'tts_runtime_error',
        message: error.message,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
