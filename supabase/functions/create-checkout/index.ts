import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

let _admin: ReturnType<typeof createClient> | null = null;
function getAdmin() {
  if (!_admin) {
    _admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _admin;
}

// Returns remaining trial days for the user (capped at 3, min 1) or null if
// the in-app trial is already over / user has no profile.
async function getRemainingTrialDays(userId: string): Promise<number | null> {
  const { data } = await getAdmin()
    .from("profiles")
    .select("trial_ends_at")
    .eq("id", userId)
    .maybeSingle();
  const endsAt = data?.trial_ends_at ? new Date(data.trial_ends_at as string).getTime() : 0;
  if (!endsAt) return null;
  const msLeft = endsAt - Date.now();
  if (msLeft <= 0) return null;
  return Math.min(3, Math.max(1, Math.ceil(msLeft / 86_400_000)));
}

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({
      email: options.email,
      limit: 1,
    });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const {
      priceId,
      quantity,
      customerEmail,
      userId,
      returnUrl,
      environment,
    } = (await req.json()) as {
      priceId: string;
      quantity?: number;
      customerEmail?: string;
      userId?: string;
      returnUrl: string;
      environment: StripeEnv;
    };

    if (!priceId || !/^[a-zA-Z0-9_-]+$/.test(priceId)) {
      throw new Error("Invalid priceId");
    }
    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("Invalid environment");
    }

    const stripe = createStripeClient(environment);
    const prices = await stripe.prices.list({ lookup_keys: [priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];
    const isRecurring = stripePrice.type === "recurring";

    const customerId =
      customerEmail || userId
        ? await resolveOrCreateCustomer(stripe, {
            email: customerEmail,
            userId,
          })
        : undefined;

    // For subscriptions, honour the in-app 3-day trial — pass the remaining
    // days as `trial_period_days` so Stripe defers the first charge.
    const trialDays = isRecurring && userId ? await getRemainingTrialDays(userId) : null;

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: quantity || 1 }],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      managed_payments: { enabled: true },
      ...(customerId && { customer: customerId }),
      ...(userId && {
        metadata: { userId, priceId, managed_payments: "true" },
        ...(isRecurring && {
          subscription_data: {
            metadata: { userId },
            ...(trialDays && { trial_period_days: trialDays }),
          },
        }),
        ...(!isRecurring && {
          payment_intent_data: { metadata: { userId, priceId } },
        }),
      }),
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (e) {
    console.error("[create-checkout]", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});