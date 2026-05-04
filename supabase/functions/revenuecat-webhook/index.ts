// RevenueCat Webhook → sync subscriptions table
// Receives events from RevenueCat (INITIAL_PURCHASE, RENEWAL, CANCELLATION,
// EXPIRATION, BILLING_ISSUE, PRODUCT_CHANGE, NON_RENEWING_PURCHASE) and
// upserts public.subscriptions + flips profiles.payment_method_attached.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBHOOK_AUTH = Deno.env.get('REVENUECAT_WEBHOOK_AUTH')!;

const PRO_STATUSES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'TEMPORARY_ENTITLEMENT_GRANT',
]);

const REVOKE_STATUSES = new Set([
  'EXPIRATION',
  'CANCELLATION', // user cancelled — we still keep access until expiration, but mark canceled
  'BILLING_ISSUE',
  'SUBSCRIPTION_PAUSED',
  'REFUND',
]);

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Verify shared-secret Authorization header
  const auth = req.headers.get('authorization') || '';
  if (!WEBHOOK_AUTH || !timingSafeEqual(auth, WEBHOOK_AUTH)) {
    console.warn('[revenuecat-webhook] unauthorized', { has: !!auth });
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch (_e) {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const event = payload?.event;
  if (!event?.type) {
    return new Response(JSON.stringify({ error: 'missing event' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log('[revenuecat-webhook] event', {
    type: event.type,
    app_user_id: event.app_user_id,
    product_id: event.product_id,
  });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  // Idempotency: skip if we have already processed this event id
  const eventId: string | undefined = event.id;
  if (eventId) {
    const { data: existingEvent } = await supabase
      .from('revenuecat_events')
      .select('event_id')
      .eq('event_id', eventId)
      .maybeSingle();
    if (existingEvent) {
      console.log('[revenuecat-webhook] duplicate event ignored', eventId);
      return new Response(JSON.stringify({ ok: true, duplicate: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // app_user_id is the Supabase user id (we pass it to RC.configure)
  const userId: string | undefined =
    event.app_user_id || event.original_app_user_id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'no user id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const expirationMs = event.expiration_at_ms ?? event.purchased_at_ms;
  const subscriptionEnd = expirationMs
    ? new Date(Number(expirationMs)).toISOString()
    : null;

  let isPro = false;
  let status = 'trialing';

  if (PRO_STATUSES.has(event.type)) {
    isPro = true;
    status = 'active';
  } else if (event.type === 'CANCELLATION') {
    // User cancelled but access continues until expiration
    isPro = subscriptionEnd ? new Date(subscriptionEnd) > new Date() : false;
    status = 'canceled';
  } else if (REVOKE_STATUSES.has(event.type)) {
    isPro = false;
    status = event.type === 'BILLING_ISSUE' ? 'past_due' : 'canceled';
  }

  // Find existing subscription row
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id, subscription_end')
    .eq('user_id', userId)
    .maybeSingle();

  // Out-of-order protection: ignore stale event whose timestamp is older
  // than the currently stored subscription_end (e.g. delayed EXPIRATION
  // arriving after a fresh RENEWAL).
  const eventTsMs: number | undefined = event.event_timestamp_ms ?? event.purchased_at_ms;
  if (existing?.subscription_end && eventTsMs) {
    const currentEndMs = new Date(existing.subscription_end).getTime();
    if (eventTsMs < currentEndMs && (event.type === 'EXPIRATION' || event.type === 'CANCELLATION')) {
      console.log('[revenuecat-webhook] stale event ignored', { eventTsMs, currentEndMs });
      if (eventId) {
        await supabase.from('revenuecat_events').insert({
          event_id: eventId, user_id: userId, type: event.type, event_timestamp_ms: eventTsMs,
        });
      }
      return new Response(JSON.stringify({ ok: true, stale: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  const row = {
    user_id: userId,
    is_pro: isPro,
    status,
    product_id: event.product_id ?? null,
    revenuecat_user_id: event.app_user_id ?? null,
    original_transaction_id: event.original_transaction_id ?? null,
    store_transaction_id: event.transaction_id ?? null,
    platform: (event.store ?? 'unknown').toString().toLowerCase(),
    subscription_end: subscriptionEnd,
    subscription_start: event.purchased_at_ms
      ? new Date(Number(event.purchased_at_ms)).toISOString()
      : null,
  };

  let upsertErr;
  if (existing?.id) {
    const { error } = await supabase
      .from('subscriptions')
      .update(row)
      .eq('id', existing.id);
    upsertErr = error;
  } else {
    const { error } = await supabase.from('subscriptions').insert(row);
    upsertErr = error;
  }

  if (upsertErr) {
    console.error('[revenuecat-webhook] subscription upsert failed', upsertErr);
    return new Response(JSON.stringify({ error: upsertErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Record processed event
  if (eventId) {
    await supabase.from('revenuecat_events').insert({
      event_id: eventId,
      user_id: userId,
      type: event.type,
      event_timestamp_ms: eventTsMs ?? null,
    });
  }

  // Mark profile as having a payment method on first purchase
  if (event.type === 'INITIAL_PURCHASE' || event.type === 'NON_RENEWING_PURCHASE') {
    const { error: profErr } = await supabase
      .from('profiles')
      .update({ payment_method_attached: true })
      .eq('id', userId);
    if (profErr) {
      console.warn('[revenuecat-webhook] profile flag failed', profErr);
    }
  }

  return new Response(JSON.stringify({ ok: true, isPro, status }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
