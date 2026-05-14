import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Lang = 'ru' | 'en' | 'es';
type Context =
  | 'lifePath'
  | 'soul'
  | 'personality'
  | 'expression'
  | 'square'
  | 'karma'
  | 'overall';

interface RequestBody {
  context: Context;
  focusNumber?: number;
  language?: Lang;
  profile: {
    name?: string;
    birthDate: string;
    pythagorean?: Record<string, number>;
    chaldean?: { name?: { compound: number; single: number }; lifePath?: { compound: number; single: number } };
    square?: {
      cells: Record<string, number>;
      workingNumbers: { A: number; B: number; C: number; D: number };
    };
    karma?: {
      center: number;
      sky: number;
      earth: number;
      planets: Record<string, number>;
    };
  };
}

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const SYSTEM_PROMPT: Record<Lang, string> = {
  ru: `Ты — мастер-нумеролог с 20-летней практикой, знающий Пифагорейскую и Халдейскую системы, Квадрат Пифагора и Матрицу Кармы из 22 арканов Таро. Пиши мистично, поэтично, но при этом конкретно и применимо в жизни. Структурируй ответ заголовками и списками в Markdown. Не повторяй сами числа без объяснения. Объём 600–900 слов.`,
  en: `You are a master numerologist with 20 years of practice, fluent in Pythagorean and Chaldean systems, the Pythagorean Square and the 22-arcana Karma Matrix. Write mystically and poetically, yet concrete and life-applicable. Structure your response with Markdown headers and lists. Don't restate numbers without meaning. Length 600–900 words.`,
  es: `Eres un maestro numerólogo con 20 años de práctica, dominas los sistemas Pitagórico y Caldeo, el Cuadrado de Pitágoras y la Matriz Kármica de los 22 arcanos. Escribe de forma mística y poética, pero concreta y aplicable. Estructura la respuesta con encabezados y listas Markdown. No repitas números sin significado. Extensión 600–900 palabras.`,
};

function buildUserPrompt(body: RequestBody, lang: Lang): string {
  const p = body.profile;
  const ctxLabels: Record<Lang, Record<Context, string>> = {
    ru: {
      lifePath: 'Число Жизненного Пути',
      soul: 'Число Души',
      personality: 'Число Личности',
      expression: 'Число Выражения',
      square: 'Квадрат Пифагора',
      karma: 'Матрица Кармы',
      overall: 'Общий нумерологический портрет',
    },
    en: {
      lifePath: 'Life Path Number',
      soul: 'Soul Number',
      personality: 'Personality Number',
      expression: 'Expression Number',
      square: 'Pythagorean Square',
      karma: 'Karma Matrix',
      overall: 'Overall Numerological Portrait',
    },
    es: {
      lifePath: 'Número del Camino de Vida',
      soul: 'Número del Alma',
      personality: 'Número de Personalidad',
      expression: 'Número de Expresión',
      square: 'Cuadrado de Pitágoras',
      karma: 'Matriz Kármica',
      overall: 'Retrato Numerológico General',
    },
  };

  const dataLines: string[] = [];
  dataLines.push(`Name: ${p.name || '—'}`);
  dataLines.push(`Birth date: ${p.birthDate}`);
  if (p.pythagorean) {
    dataLines.push(`Pythagorean: ${JSON.stringify(p.pythagorean)}`);
  }
  if (p.chaldean) {
    dataLines.push(`Chaldean: ${JSON.stringify(p.chaldean)}`);
  }
  if (body.context === 'square' && p.square) {
    dataLines.push(`Square cells: ${JSON.stringify(p.square.cells)}`);
    dataLines.push(`Working numbers A/B/C/D: ${JSON.stringify(p.square.workingNumbers)}`);
  }
  if (body.context === 'karma' && p.karma) {
    dataLines.push(`Karma matrix: ${JSON.stringify(p.karma)}`);
  }
  if (body.focusNumber !== undefined) {
    dataLines.push(`Focus number: ${body.focusNumber}`);
  }

  return `${ctxLabels[lang][body.context]}\n\n${dataLines.join('\n')}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userResult } = await supabase.auth.getUser();
    const user = userResult.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as RequestBody;
    if (!body || !body.context || !body.profile?.birthDate) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const language: Lang = (body.language ?? 'ru') as Lang;
    const cacheKey = await sha256(
      JSON.stringify({
        c: body.context,
        f: body.focusNumber ?? null,
        n: body.profile.name ?? '',
        d: body.profile.birthDate,
        py: body.profile.pythagorean ?? null,
        ch: body.profile.chaldean ?? null,
        sq: body.profile.square ?? null,
        k: body.profile.karma ?? null,
      })
    );

    // Try cache
    const { data: cached } = await supabase
      .from('numerology_deep_cache')
      .select('content')
      .eq('user_id', user.id)
      .eq('cache_key', cacheKey)
      .eq('language', language)
      .maybeSingle();

    if (cached?.content) {
      return new Response(
        JSON.stringify({ content: cached.content, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI
    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT[language] },
          { role: 'user', content: buildUserPrompt(body, language) },
        ],
      }),
    });

    if (aiResp.status === 429) {
      return new Response(
        JSON.stringify({ error: 'rate_limited' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (aiResp.status === 402) {
      return new Response(
        JSON.stringify({ error: 'credits_exhausted' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('AI gateway error:', aiResp.status, errText);
      return new Response(
        JSON.stringify({ error: 'ai_error', detail: errText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiJson = await aiResp.json();
    const content: string =
      aiJson?.choices?.[0]?.message?.content?.toString().trim() ?? '';

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'empty_response' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Persist cache (best effort)
    await supabase.from('numerology_deep_cache').insert({
      user_id: user.id,
      cache_key: cacheKey,
      language,
      content,
    });

    return new Response(
      JSON.stringify({ content, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('numerology deep edge error:', err);
    return new Response(
      JSON.stringify({ error: String(err?.message ?? err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});