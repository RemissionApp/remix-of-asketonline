import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import 'https://deno.land/x/xhr@0.1.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs signed URL error: missing API key');
      return jsonResponse(
        { error: 'ELEVENLABS_API_KEY is not configured', code: 'MISSING_API_KEY' },
        500
      );
    }

    const { agentId } = await req.json().catch(() => ({}));

    if (typeof agentId !== 'string' || !agentId.trim()) {
      return jsonResponse(
        { error: 'Agent ID is required', code: 'INVALID_AGENT_ID' },
        400
      );
    }

    // Запрашиваем подписанную ссылку от ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs signed URL API error', {
        status: response.status,
        body: errorText,
        agentId,
      });
      return jsonResponse(
        {
          error: `ElevenLabs API error: ${response.status}`,
          code: response.status === 401 || response.status === 403 ? 'ELEVENLABS_PERMISSION_DENIED' : 'ELEVENLABS_API_ERROR',
          details: errorText,
        },
        response.status === 401 || response.status === 403 ? 502 : 500
      );
    }

    const data = await response.json();

    if (!data?.signed_url) {
      console.error('ElevenLabs signed URL missing in response', { agentId });
      return jsonResponse(
        { error: 'No signed URL received from ElevenLabs', code: 'SIGNED_URL_MISSING' },
        502
      );
    }

    return jsonResponse({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('ElevenLabs signed URL unexpected error:', error);
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'UNKNOWN_ERROR',
      },
      500
    );
  }
});
