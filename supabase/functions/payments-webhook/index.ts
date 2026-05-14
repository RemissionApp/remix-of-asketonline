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

const FROM_EMAIL = "Asceta <hello@remissionsoft.net>";
const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!lovableKey || !resendKey || !to) return;
    const r = await fetch(`${RESEND_GATEWAY}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });
    if (!r.ok) console.error("[payments-webhook] resend failed", await r.text());
  } catch (e) {
    console.error("[payments-webhook] email error", e);
  }
}

async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const { data } = await getSupabase().auth.admin.getUserById(userId);
    return data.user?.email ?? null;
  } catch {
    return null;
  }
}

function welcomeEmailHtml(): string {
  return `
  <div style="font-family:Arial,sans-serif;background:#ffffff;color:#222;padding:24px;max-width:560px;margin:0 auto;">
    <h1 style="font-size:22px;margin:0 0 12px;">Добро пожаловать в Asceta Pro ✦</h1>
    <p style="font-size:14px;line-height:1.55;color:#444;">Спасибо, что поддержал путь — теперь у тебя открыт полный доступ.</p>
    <h3 style="font-size:15px;margin:18px 0 6px;">С чего начать:</h3>
    <ul style="font-size:14px;line-height:1.6;color:#444;padding-left:18px;">
      <li><b>Лира</b> — голосовой наставник: 30 минут разговоров каждый месяц.</li>
      <li><b>Гороскопы и нумерология</b> — полные расчёты по твоей карте.</li>
      <li><b>Безлимит пактов аскезы</b> и все миссии.</li>
    </ul>
    <p style="margin:22px 0 8px;">
      <a href="https://asceta.app/main" style="background:#E8C16C;color:#0b0b14;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:600;">Открыть Asceta</a>
    </p>
    <p style="font-size:12px;color:#888;margin-top:24px;">Управлять подпиской можно в Профиль → Подписка.</p>
  </div>`;
}

function cancelEmailHtml(periodEnd: string | null): string {
  const dateLine = periodEnd
    ? `Доступ к Pro останется до <b>${new Date(periodEnd).toLocaleDateString("ru-RU")}</b>.`
    : "Доступ к Pro останется до конца оплаченного периода.";
  return `
  <div style="font-family:Arial,sans-serif;background:#ffffff;color:#222;padding:24px;max-width:560px;margin:0 auto;">
    <h1 style="font-size:22px;margin:0 0 12px;">Жаль, что уходишь 🌙</h1>
    <p style="font-size:14px;line-height:1.55;color:#444;">Подписка Asceta Pro отменена. ${dateLine}</p>
    <p style="font-size:14px;line-height:1.55;color:#444;">Если вернёшься — Лира и весь Pro-функционал будут ждать. Можно возобновить одной кнопкой.</p>
    <p style="margin:22px 0 8px;">
      <a href="https://asceta.app/comparison" style="background:#E8C16C;color:#0b0b14;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:600;">Посмотреть Pro</a>
    </p>
  </div>`;
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
    const { data: prev } = await supabase
      .from("subscriptions")
      .select("cancel_at_period_end")
      .eq("id", existing.id)
      .maybeSingle();
    await supabase.from("subscriptions").update(payload).eq("id", existing.id);
    // Cancellation email when user just toggled cancel_at_period_end on
    if (
      payload.cancel_at_period_end &&
      !prev?.cancel_at_period_end
    ) {
      const email = await getUserEmail(userId);
      if (email) await sendEmail(email, "Подписка Asceta Pro отменена", cancelEmailHtml(payload.current_period_end));
    }
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
    // First time we ever see this Stripe subscription → welcome email
    if (isPro) {
      const email = await getUserEmail(userId);
      if (email) await sendEmail(email, "Добро пожаловать в Asceta Pro ✦", welcomeEmailHtml());
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

function currentMonthYear(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function handleOneTimePayment(session: any) {
  if (session.mode !== "payment" || session.payment_status !== "paid") return;
  const userId = session.metadata?.userId;
  const priceId = session.metadata?.priceId;
  if (!userId) return;

  if (priceId === "asceta_minutes_10_pack") {
    const monthYear = currentMonthYear();
    const supabase = getSupabase();
    // Fetch existing limit (or default 30) and add 10 minutes.
    const { data: row } = await supabase
      .from("monthly_call_minutes")
      .select("id, minutes_limit")
      .eq("user_id", userId)
      .eq("month_year", monthYear)
      .maybeSingle();
    const newLimit = (row?.minutes_limit ?? 30) + 10;
    if (row?.id) {
      await supabase
        .from("monthly_call_minutes")
        .update({ minutes_limit: newLimit, updated_at: new Date().toISOString() })
        .eq("id", row.id);
    } else {
      await supabase.from("monthly_call_minutes").insert({
        user_id: userId,
        month_year: monthYear,
        minutes_used: 0,
        minutes_limit: newLimit,
      });
    }
    console.log("[payments-webhook] +10 minutes for", userId);
  }
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
      case "checkout.session.completed":
        await handleOneTimePayment(event.data.object);
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