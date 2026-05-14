// Cron-triggered function: expires trials for users whose 3-day trial ended
// without a payment. Sets subscriptions.status = 'canceled' and is_pro = false.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  );

  // Find profiles where trial expired and no payment attached
  const nowIso = new Date().toISOString();
  const { data: expiredProfiles, error: profErr } = await supabase
    .from('profiles')
    .select('id')
    .lt('trial_ends_at', nowIso)
    .eq('payment_method_attached', false);

  if (profErr) {
    console.error('[expire-trials] profile query failed', profErr);
    return new Response(JSON.stringify({ error: profErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!expiredProfiles?.length) {
    return new Response(JSON.stringify({ ok: true, expired: 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const ids = expiredProfiles.map((p) => p.id);

  // SAFETY: Only sweep rows that are still in the trialing state. Never touch
  // 'active', 'past_due' or already 'canceled' rows — those belong to paying
  // users (managed exclusively by the revenuecat-webhook).
  const { error: updErr, count } = await supabase
    .from('subscriptions')
    .update({ is_pro: false, status: 'canceled' }, { count: 'exact' })
    .in('user_id', ids)
    .eq('status', 'trialing');

  if (updErr) {
    console.error('[expire-trials] subscription update failed', updErr);
  }

  console.log('[expire-trials] processed', { matchedProfiles: ids.length, updatedSubs: count });

  return new Response(JSON.stringify({ ok: true, expired: count ?? 0 }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
