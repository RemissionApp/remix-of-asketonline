import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    const {
      text,
      voice = 'Custom',
      model = 'eleven_turbo_v2',
    } = await req.json();

    if (!text) {
      throw new Error('Text is required');
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
      throw new Error(`Eleven Labs API error: ${response.status} ${errorText}`);
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
