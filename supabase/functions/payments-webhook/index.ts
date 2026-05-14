import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

function isActiveStatus(status: string): boolean {
  return status === "active" || status === "trialing";
}

async function upsertFromSubscription(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("[payments-webhook] no userId in subscription metadata");
    return;
  }

  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id;
  const productId = item?.price?.product;
  const periodStart =
    item?.current_period_start ?? subscription.current_period_start;
  const periodEnd =
    item?.current_period_end ?? subscription.current_period_end;

  const isPro = isActiveStatus(subscription.status);

  // Try update by stripe_subscription_id first; else insert.
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  const payload = {
    user_id: userId,
    is_pro: isPro,
    status: subscription.status,
    platform: "web",
    product_id: priceId ?? productId ?? null,
    price_id: priceId ?? null,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    current_period_start: periodStart
      ? new Date(periodStart * 1000).toISOString()
      : null,
    current_period_end: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
    subscription_start: periodStart
      ? new Date(periodStart * 1000).toISOString()
      : null,
    subscription_end: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
    cancel_at_period_end: !!subscription.cancel_at_period_end,
    environment: env,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    await supabase.from("subscriptions").update(payload).eq("id", existing.id);
  } else {
    // No existing Stripe row — try the user's pre-existing trial row first,
    // so we don't create duplicates per user.
    const { data: trialRow } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .is("stripe_subscription_id", null)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (trialRow?.id) {
      await supabase
        .from("subscriptions")
        .update(payload)
        .eq("id", trialRow.id);
    } else {
      await supabase.from("subscriptions").insert(payload);
    }
  }
}

async function markCanceled(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({
      status: "canceled",
      is_pro: false,
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("[payments-webhook] invalid env:", rawEnv);
    return new Response(
      JSON.stringify({ received: true, ignored: "invalid env" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("[payments-webhook]", event.type);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await upsertFromSubscription(event.data.object, env);
        break;
      case "customer.subscription.deleted":
        await markCanceled(event.data.object, env);
        break;
      default:
        // checkout.session.completed, invoice.* — ignored: subscription.* covers state.
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[payments-webhook] error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});