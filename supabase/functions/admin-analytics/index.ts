// deno-lint-ignore-file
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Plan prices in USD (matches UI in TrialExpiredGate / FeatureComparison)
const PLAN_PRICES_USD: Record<string, { amount: number; monthly: number }> = {
  asceta_pro_monthly: { amount: 9.99, monthly: 9.99 },
  asceta_pro_yearly: { amount: 69.99, monthly: 69.99 / 12 },
  pro_monthly: { amount: 9.99, monthly: 9.99 },
  pro_yearly: { amount: 69.99, monthly: 69.99 / 12 },
};

const planMonthly = (priceId?: string | null, productId?: string | null) => {
  const k = (priceId || productId || '').toLowerCase();
  return PLAN_PRICES_USD[k]?.monthly ?? 9.99;
};
const planAmount = (priceId?: string | null, productId?: string | null) => {
  const k = (priceId || productId || '').toLowerCase();
  return PLAN_PRICES_USD[k]?.amount ?? 9.99;
};

const dayKey = (d: string | Date) => new Date(d).toISOString().slice(0, 10);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const auth = req.headers.get('Authorization') ?? '';
    if (!auth) return json({ error: 'unauthorized' }, 401);

    // Identify caller
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: 'unauthorized' }, 401);

    // Verify admin role
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) return json({ error: 'forbidden' }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;
    const days = Math.min(Math.max(Number(body.days) || 30, 1), 365);
    const since = new Date(Date.now() - days * 86400_000).toISOString();

    switch (action) {
      case 'overview': {
        const [{ count: totalUsers }, { count: newUsers }, profiles, subs, minutes, pv] = await Promise.all([
          admin.from('profiles').select('*', { count: 'exact', head: true }),
          admin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', since),
          admin.from('page_views').select('user_id, created_at').gte('created_at', since).limit(50000),
          admin.from('subscriptions').select('is_pro, status'),
          admin.from('monthly_call_minutes').select('minutes_used'),
          admin.from('page_views').select('platform, referrer').gte('created_at', since).limit(50000),
        ]);
        const dau = new Set<string>();
        const wau = new Set<string>();
        const mau = new Set<string>();
        const now = Date.now();
        const byDay: Record<string, number> = {};
        for (const v of profiles.data ?? []) {
          if (!v.user_id) continue;
          const t = new Date(v.created_at).getTime();
          const ageMs = now - t;
          if (ageMs < 86400_000) dau.add(v.user_id);
          if (ageMs < 7 * 86400_000) wau.add(v.user_id);
          mau.add(v.user_id);
          const day = new Date(v.created_at).toISOString().slice(0, 10);
          byDay[day] = (byDay[day] || 0) + 1;
        }
        const proCount = (subs.data ?? []).filter((s: any) => s.is_pro).length;
        const totalMinutes = (minutes.data ?? []).reduce((s: number, r: any) => s + Number(r.minutes_used || 0), 0);
        // Segmentation
        const platforms: Record<string, number> = {};
        const referrers: Record<string, number> = {};
        for (const r of pv.data ?? []) {
          const p = (r.platform || 'unknown').toLowerCase();
          platforms[p] = (platforms[p] || 0) + 1;
          let host = 'direct';
          try {
            if (r.referrer) host = new URL(r.referrer).hostname.replace(/^www\./, '');
          } catch { /* noop */ }
          referrers[host] = (referrers[host] || 0) + 1;
        }
        return json({
          totalUsers: totalUsers ?? 0,
          newUsers: newUsers ?? 0,
          dau: dau.size,
          wau: wau.size,
          mau: mau.size,
          proCount,
          conversionRate: totalUsers ? +(proCount / totalUsers * 100).toFixed(1) : 0,
          totalCallMinutes: Math.round(totalMinutes),
          dailyActivity: Object.entries(byDay)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count })),
          platforms: Object.entries(platforms).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
          referrers: Object.entries(referrers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10),
        });
      }

      case 'users': {
        const { data: profs } = await admin
          .from('profiles')
          .select('id, name, created_at, rank, energy_points, total_days')
          .order('created_at', { ascending: false })
          .limit(500);
        const ids = (profs ?? []).map((p: any) => p.id);
        const [{ data: subs }, { data: pacts }, { data: mins }, { data: usersAuth }, { data: lastSeen }] = await Promise.all([
          admin.from('subscriptions').select('user_id, is_pro, status, trial_ends_at, current_period_start, price_id, product_id').in('user_id', ids),
          admin.from('pacts').select('user_id, status').in('user_id', ids),
          admin.from('monthly_call_minutes').select('user_id, minutes_used').in('user_id', ids),
          admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
          admin.from('page_views').select('user_id, created_at').in('user_id', ids).order('created_at', { ascending: false }).limit(5000),
        ]);
        const subMap = new Map((subs ?? []).map((s: any) => [s.user_id, s]));
        const pactMap = new Map<string, number>();
        for (const p of pacts ?? []) pactMap.set(p.user_id, (pactMap.get(p.user_id) || 0) + 1);
        const minMap = new Map<string, number>();
        for (const m of mins ?? []) minMap.set(m.user_id, (minMap.get(m.user_id) || 0) + Number(m.minutes_used || 0));
        const emailMap = new Map((usersAuth?.users ?? []).map((u: any) => [u.id, u.email]));
        const lastSeenMap = new Map<string, string>();
        for (const v of lastSeen ?? []) {
          if (v.user_id && !lastSeenMap.has(v.user_id)) lastSeenMap.set(v.user_id, v.created_at);
        }
        return json({
          users: (profs ?? []).map((p: any) => ({
            id: p.id,
            email: emailMap.get(p.id) ?? null,
            name: p.name,
            created_at: p.created_at,
            rank: p.rank,
            energyPoints: p.energy_points,
            totalDays: p.total_days,
            subscription: subMap.get(p.id) ?? null,
            pactsCount: pactMap.get(p.id) ?? 0,
            callMinutes: Math.round(minMap.get(p.id) ?? 0),
            lastSeen: lastSeenMap.get(p.id) ?? null,
          })),
        });
      }

      case 'pages': {
        const { data } = await admin
          .from('page_views')
          .select('path, duration_ms, session_id, user_id, platform')
          .gte('created_at', since)
          .limit(50000);
        const platformFilter = (body.platform as string) || '';
        const byPath: Record<string, { views: number; durations: number[]; users: Set<string> }> = {};
        const sessionPaths: Record<string, Set<string>> = {};
        for (const r of data ?? []) {
          if (platformFilter && (r.platform || '').toLowerCase() !== platformFilter) continue;
          const k = r.path;
          byPath[k] ??= { views: 0, durations: [], users: new Set() };
          byPath[k].views++;
          if (r.duration_ms) byPath[k].durations.push(r.duration_ms);
          if (r.user_id) byPath[k].users.add(r.user_id);
          sessionPaths[r.session_id] ??= new Set();
          sessionPaths[r.session_id].add(k);
        }
        const bouncedSessions = Object.values(sessionPaths).filter((s) => s.size === 1).length;
        const totalSessions = Object.keys(sessionPaths).length;
        return json({
          totalSessions,
          bounceRate: totalSessions ? +(bouncedSessions / totalSessions * 100).toFixed(1) : 0,
          pages: Object.entries(byPath)
            .map(([path, v]) => ({
              path,
              views: v.views,
              uniqueUsers: v.users.size,
              avgDurationMs: v.durations.length
                ? Math.round(v.durations.reduce((a, b) => a + b, 0) / v.durations.length)
                : 0,
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 100),
        });
      }

      case 'events': {
        const { data } = await admin
          .from('user_events')
          .select('event_name, created_at, user_id')
          .gte('created_at', since)
          .limit(50000);
        const counts: Record<string, number> = {};
        const byDay: Record<string, Record<string, number>> = {};
        for (const e of data ?? []) {
          counts[e.event_name] = (counts[e.event_name] || 0) + 1;
          const day = new Date(e.created_at).toISOString().slice(0, 10);
          byDay[day] ??= {};
          byDay[day][e.event_name] = (byDay[day][e.event_name] || 0) + 1;
        }
        return json({
          events: Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
          timeline: Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, e]) => ({ date, ...e })),
        });
      }

      case 'funnel': {
        const steps: string[] = Array.isArray(body.steps) ? body.steps : [];
        if (steps.length < 2) return json({ error: 'need 2+ steps' }, 400);
        const { data } = await admin
          .from('user_events')
          .select('event_name, user_id, created_at')
          .in('event_name', steps)
          .gte('created_at', since)
          .order('created_at', { ascending: true })
          .limit(100000);
        const userSteps = new Map<string, Set<string>>();
        for (const e of data ?? []) {
          if (!e.user_id) continue;
          if (!userSteps.has(e.user_id)) userSteps.set(e.user_id, new Set());
          userSteps.get(e.user_id)!.add(e.event_name);
        }
        const result = steps.map((s, i) => {
          const need = steps.slice(0, i + 1);
          let count = 0;
          for (const set of userSteps.values()) {
            if (need.every((n) => set.has(n))) count++;
          }
          return { step: s, users: count };
        });
        return json({ funnel: result });
      }

      case 'revenue': {
        const { data: subs } = await admin
          .from('subscriptions')
          .select('user_id, is_pro, status, price_id, product_id, current_period_start, current_period_end, cancel_at_period_end, trial_ends_at, created_at, subscription_start');
        const { count: trialingTotal } = await admin
          .from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'trialing');
        const all = subs ?? [];
        const active = all.filter((s: any) => s.is_pro && (s.status === 'active' || s.status === 'trialing'));
        const newPaid = all.filter((s: any) => s.is_pro && s.subscription_start && s.subscription_start >= since);
        const cancelled = all.filter((s: any) => s.cancel_at_period_end);
        const pastDue = all.filter((s: any) => s.status === 'past_due');
        const mrr = active.reduce((sum: number, s: any) => sum + planMonthly(s.price_id, s.product_id), 0);
        const arpu = active.length ? mrr / active.length : 0;
        // Trial → Paid conversion: among users whose trial ended in the period
        const trialEnded = all.filter((s: any) => s.trial_ends_at && s.trial_ends_at <= new Date().toISOString() && s.trial_ends_at >= since);
        const converted = trialEnded.filter((s: any) => s.is_pro && s.status === 'active').length;
        const trialConv = trialEnded.length ? +(converted / trialEnded.length * 100).toFixed(1) : 0;
        // Daily revenue (by subscription_start, monthly equivalent)
        const byDay: Record<string, number> = {};
        for (const s of active) {
          if (!s.subscription_start || s.subscription_start < since) continue;
          const d = dayKey(s.subscription_start);
          byDay[d] = (byDay[d] || 0) + planAmount(s.price_id, s.product_id);
        }
        const planBreakdown: Record<string, number> = {};
        for (const s of active) {
          const k = s.price_id || s.product_id || 'unknown';
          planBreakdown[k] = (planBreakdown[k] || 0) + 1;
        }
        // Recent paid subs with email
        const recentPaid = all
          .filter((s: any) => s.is_pro || s.status === 'past_due')
          .sort((a: any, b: any) => (b.subscription_start || b.created_at).localeCompare(a.subscription_start || a.created_at))
          .slice(0, 50);
        const emails = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const emailMap = new Map((emails.data?.users ?? []).map((u: any) => [u.id, u.email]));
        return json({
          mrr: +mrr.toFixed(2),
          arpu: +arpu.toFixed(2),
          activePro: active.length,
          newPaid: newPaid.length,
          cancelled: cancelled.length,
          pastDue: pastDue.length,
          trialing: trialingTotal ?? 0,
          trialConversion: trialConv,
          revenueByDay: Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => ({ date, amount: +amount.toFixed(2) })),
          planBreakdown: Object.entries(planBreakdown).map(([plan, count]) => ({ plan, count })),
          recent: recentPaid.map((s: any) => ({
            user_id: s.user_id,
            email: emailMap.get(s.user_id) ?? null,
            plan: s.price_id || s.product_id,
            status: s.status,
            is_pro: s.is_pro,
            cancel_at_period_end: s.cancel_at_period_end,
            subscription_start: s.subscription_start,
            current_period_end: s.current_period_end,
          })),
        });
      }

      case 'retention': {
        const { data: profs } = await admin
          .from('profiles')
          .select('id, created_at')
          .gte('created_at', new Date(Date.now() - 90 * 86400_000).toISOString())
          .limit(5000);
        const ids = (profs ?? []).map((p: any) => p.id);
        const { data: pv } = await admin
          .from('page_views')
          .select('user_id, created_at')
          .in('user_id', ids)
          .limit(100000);
        const visitsByUser = new Map<string, Set<string>>(); // user → set of day keys
        for (const r of pv ?? []) {
          if (!r.user_id) continue;
          if (!visitsByUser.has(r.user_id)) visitsByUser.set(r.user_id, new Set());
          visitsByUser.get(r.user_id)!.add(dayKey(r.created_at));
        }
        const buckets = { d1: { active: 0, total: 0 }, d7: { active: 0, total: 0 }, d30: { active: 0, total: 0 } };
        const now = Date.now();
        for (const p of profs ?? []) {
          const t = new Date(p.created_at).getTime();
          const ageDays = (now - t) / 86400_000;
          const days = visitsByUser.get(p.id) ?? new Set();
          const created = dayKey(p.created_at);
          const dayPlus = (n: number) => dayKey(new Date(t + n * 86400_000));
          if (ageDays >= 1) {
            buckets.d1.total++;
            if (days.has(dayPlus(1))) buckets.d1.active++;
          }
          if (ageDays >= 7) {
            buckets.d7.total++;
            // any visit in days 1..7
            for (let i = 1; i <= 7; i++) if (days.has(dayPlus(i))) { buckets.d7.active++; break; }
          }
          if (ageDays >= 30) {
            buckets.d30.total++;
            for (let i = 1; i <= 30; i++) if (days.has(dayPlus(i))) { buckets.d30.active++; break; }
          }
        }
        // Cohorts: weeks of registration × weeks of life
        const weeks: Record<string, { total: number; ret: number[] }> = {};
        for (const p of profs ?? []) {
          const t = new Date(p.created_at).getTime();
          const cohortDate = new Date(t);
          cohortDate.setUTCDate(cohortDate.getUTCDate() - cohortDate.getUTCDay()); // week start
          const cohort = cohortDate.toISOString().slice(0, 10);
          weeks[cohort] ??= { total: 0, ret: [0, 0, 0, 0, 0] };
          weeks[cohort].total++;
          const days = visitsByUser.get(p.id) ?? new Set();
          for (let w = 0; w < 5; w++) {
            const start = t + w * 7 * 86400_000;
            const end = t + (w + 1) * 7 * 86400_000;
            if (end > now) break;
            for (const d of days) {
              const dt = new Date(d).getTime();
              if (dt >= start && dt < end) { weeks[cohort].ret[w]++; break; }
            }
          }
        }
        const cohorts = Object.entries(weeks)
          .sort(([a], [b]) => b.localeCompare(a))
          .slice(0, 12)
          .map(([cohort, v]) => ({
            cohort,
            total: v.total,
            weeks: v.ret.map((r, i) => v.total ? +(r / v.total * 100).toFixed(0) : 0),
          }));
        return json({
          d1: buckets.d1.total ? +(buckets.d1.active / buckets.d1.total * 100).toFixed(1) : 0,
          d7: buckets.d7.total ? +(buckets.d7.active / buckets.d7.total * 100).toFixed(1) : 0,
          d30: buckets.d30.total ? +(buckets.d30.active / buckets.d30.total * 100).toFixed(1) : 0,
          cohortSizes: { d1: buckets.d1.total, d7: buckets.d7.total, d30: buckets.d30.total },
          cohorts,
        });
      }

      case 'feature-usage': {
        const [{ data: q }, { data: cs }, { data: mis }, { data: pacts }, { data: nr }, { data: dl }] = await Promise.all([
          admin.from('universe_questions').select('user_id, created_at').gte('created_at', since).limit(50000),
          admin.from('call_summaries').select('user_id, called_at').gte('called_at', since).limit(50000),
          admin.from('mission_progress').select('user_id, accepted_at').gte('accepted_at', since).limit(50000),
          admin.from('pacts').select('user_id, created_at').gte('created_at', since).limit(50000),
          admin.from('numerology_readings').select('user_id, created_at').gte('created_at', since).limit(50000),
          admin.from('daily_limits').select('user_id, meditations_count, date').gte('date', since.slice(0, 10)).limit(50000),
        ]);
        const u = (rows: any[]) => new Set(rows.map((r) => r.user_id).filter(Boolean)).size;
        const meditationsUsers = new Set<string>();
        for (const r of dl ?? []) if ((r.meditations_count ?? 0) > 0 && r.user_id) meditationsUsers.add(r.user_id);
        return json({
          features: [
            { name: 'Вопросы Вселенной', users: u(q ?? []), events: (q ?? []).length },
            { name: 'Звонки', users: u(cs ?? []), events: (cs ?? []).length },
            { name: 'Миссии', users: u(mis ?? []), events: (mis ?? []).length },
            { name: 'Аскезы', users: u(pacts ?? []), events: (pacts ?? []).length },
            { name: 'Нумерология', users: u(nr ?? []), events: (nr ?? []).length },
            { name: 'Медитации', users: meditationsUsers.size, events: (dl ?? []).reduce((a: number, b: any) => a + (b.meditations_count ?? 0), 0) },
          ].sort((a, b) => b.users - a.users),
        });
      }

      case 'user-detail': {
        const userId = body.userId as string;
        if (!userId) return json({ error: 'userId required' }, 400);
        const [
          prof, sub, mins, pacts, mis, qs, evs, pvs, push, sums,
        ] = await Promise.all([
          admin.from('profiles').select('*').eq('id', userId).maybeSingle(),
          admin.from('subscriptions').select('*').eq('user_id', userId).maybeSingle(),
          admin.from('monthly_call_minutes').select('*').eq('user_id', userId).order('month_year', { ascending: false }).limit(12),
          admin.from('pacts').select('id, title, status, duration, created_at, type').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
          admin.from('mission_progress').select('mission_id, completed, accepted_at, completed_at').eq('user_id', userId).order('accepted_at', { ascending: false }).limit(20),
          admin.from('universe_questions').select('question, answer, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
          admin.from('user_events').select('event_name, properties, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
          admin.from('page_views').select('path, platform, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
          admin.from('push_subscriptions').select('id, is_active, created_at, device_info').eq('user_id', userId),
          admin.from('call_summaries').select('summary, key_topics, emotional_tone, called_at, duration_seconds').eq('user_id', userId).order('called_at', { ascending: false }).limit(10),
        ]);
        const { data: u } = await admin.auth.admin.getUserById(userId);
        return json({
          profile: prof.data,
          email: u?.user?.email ?? null,
          subscription: sub.data,
          callMinutes: mins.data ?? [],
          pacts: pacts.data ?? [],
          missions: mis.data ?? [],
          questions: qs.data ?? [],
          events: evs.data ?? [],
          pageViews: pvs.data ?? [],
          pushSubscriptions: push.data ?? [],
          callSummaries: sums.data ?? [],
        });
      }

      case 'health': {
        const [{ data: subs }, { data: push }, { data: stripeEvents }] = await Promise.all([
          admin.from('subscriptions').select('user_id, status, price_id, product_id, current_period_end, cancel_at_period_end').in('status', ['past_due', 'incomplete', 'incomplete_expired', 'unpaid']),
          admin.from('push_subscriptions').select('is_active'),
          admin.from('stripe_events').select('event_id, type, processed_at, environment').order('processed_at', { ascending: false }).limit(20),
        ]);
        const pushActive = (push ?? []).filter((p: any) => p.is_active).length;
        const pushInactive = (push ?? []).length - pushActive;
        const emails = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const emailMap = new Map((emails.data?.users ?? []).map((u: any) => [u.id, u.email]));
        return json({
          problemSubs: (subs ?? []).map((s: any) => ({ ...s, email: emailMap.get(s.user_id) ?? null })),
          pushActive,
          pushInactive,
          recentStripeEvents: stripeEvents ?? [],
        });
      }

      case 'admin-action': {
        const type = body.type as string;
        const userId = body.userId as string;
        if (!userId || !type) return json({ error: 'type+userId required' }, 400);
        if (type === 'grant_pro') {
          const monthsRaw = Number(body.months ?? 1);
          const months = Number.isFinite(monthsRaw) ? Math.min(Math.max(monthsRaw, 1), 24) : 1;
          const periodEnd = new Date(Date.now() + months * 30 * 86400_000).toISOString();
          const { data: existing } = await admin.from('subscriptions').select('id').eq('user_id', userId).maybeSingle();
          if (existing) {
            await admin.from('subscriptions').update({
              is_pro: true, status: 'active', product_id: 'pro_monthly',
              current_period_end: periodEnd, subscription_end: periodEnd,
              cancel_at_period_end: false, updated_at: new Date().toISOString(),
            }).eq('user_id', userId);
          } else {
            await admin.from('subscriptions').insert({
              user_id: userId, is_pro: true, status: 'active', product_id: 'pro_monthly',
              subscription_start: new Date().toISOString(),
              current_period_start: new Date().toISOString(),
              current_period_end: periodEnd, subscription_end: periodEnd, platform: 'manual',
            });
          }
          return json({ ok: true });
        }
        if (type === 'reset_limits') {
          const today = new Date().toISOString().slice(0, 10);
          await admin.from('daily_limits').update({
            universe_questions_count: 0, voice_calls_count: 0, meditations_count: 0, cosmic_missions_count: 0,
            updated_at: new Date().toISOString(),
          }).eq('user_id', userId).eq('date', today);
          return json({ ok: true });
        }
        if (type === 'delete_account') {
          // Delete app data via batch function (uses service role auth.uid → caller).
          // Easier: delete directly through service client from each table mirror of batch_delete_user_data.
          const tables = [
            'pact_days', 'achievements', 'pacts', 'universe_questions', 'universe_chat_messages',
            'universe_chat_sessions', 'missions', 'mission_progress', 'mission_progress_detailed',
            'daily_reflections', 'mission_choices', 'cosmic_artifacts', 'detailed_horoscopes',
            'full_horoscopes', 'astro_profiles', 'numerology_descriptions', 'numerology_readings',
            'push_subscriptions', 'subscriptions', 'daily_limits', 'user_onboarding_state',
            'call_summaries', 'monthly_call_minutes', 'audit_logs',
          ];
          for (const t of tables) {
            try { await admin.from(t).delete().eq('user_id', userId); } catch { /* ignore */ }
          }
          try { await admin.from('profiles').delete().eq('id', userId); } catch { /* ignore */ }
          await admin.auth.admin.deleteUser(userId);
          return json({ ok: true });
        }
        return json({ error: 'unknown admin action' }, 400);
      }

      default:
        return json({ error: 'unknown action' }, 400);
    }
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
