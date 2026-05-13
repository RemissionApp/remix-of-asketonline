// delete-account — secure account deletion via service role.
// Verifies password by re-authenticating the caller, runs batch_delete_user_data,
// then removes the auth user.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsErr } = await userClient.auth.getUser(token);
    if (claimsErr || !claimsData?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = claimsData.user.id as string;
    const email = claimsData.user.email as string | undefined;

    const body = await req.json().catch(() => ({}));
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!password) {
      return new Response(JSON.stringify({ error: 'password_required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Re-verify password (only when email/password account)
    if (email) {
      const verifyClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { auth: { persistSession: false } }
      );
      const { error: verifyErr } = await verifyClient.auth.signInWithPassword({ email, password });
      if (verifyErr) {
        return new Response(JSON.stringify({ error: 'invalid_password' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // Wipe domain rows (service role bypasses ownership check, so do it directly)
    const tables = [
      'pact_days', 'achievements', 'pacts', 'universe_questions',
      'universe_chat_messages', 'universe_chat_sessions', 'missions',
      'mission_progress', 'mission_progress_detailed', 'daily_reflections',
      'mission_choices', 'cosmic_artifacts', 'detailed_horoscopes',
      'full_horoscopes', 'astro_profiles', 'numerology_descriptions',
      'numerology_readings', 'push_subscriptions', 'subscriptions',
      'daily_limits', 'user_onboarding_state', 'call_summaries',
      'monthly_call_minutes', 'audit_logs',
    ];
    // pact_days needs join — handle via pact_id IN (...)
    const { data: pactRows } = await admin.from('pacts').select('id').eq('user_id', userId);
    const pactIds = (pactRows ?? []).map((r: any) => r.id);
    if (pactIds.length) await admin.from('pact_days').delete().in('pact_id', pactIds);
    for (const t of tables) {
      if (t === 'pact_days') continue;
      try { await admin.from(t).delete().eq('user_id', userId); } catch (_) {}
    }
    try { await admin.from('profiles').delete().eq('id', userId); } catch (_) {}

    // Best-effort: remove avatar files
    try {
      const { data: list } = await admin.storage.from('avatars').list(userId);
      if (list?.length) {
        await admin.storage.from('avatars').remove(list.map(o => `${userId}/${o.name}`));
      }
    } catch (_) {}

    // Finally delete the auth user
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      console.error('auth deleteUser failed', delErr);
      return new Response(JSON.stringify({ error: 'auth_delete_failed', details: delErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('delete-account error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});