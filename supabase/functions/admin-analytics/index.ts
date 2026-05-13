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
        const [{ count: totalUsers }, { count: newUsers }, profiles, subs, minutes] = await Promise.all([
          admin.from('profiles').select('*', { count: 'exact', head: true }),
          admin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', since),
          admin.from('page_views').select('user_id, created_at').gte('created_at', since).limit(50000),
          admin.from('subscriptions').select('is_pro, status'),
          admin.from('monthly_call_minutes').select('minutes_used'),
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
        });
      }

      case 'users': {
        const { data: profs } = await admin
          .from('profiles')
          .select('id, name, created_at, rank, energy_points, total_days')
          .order('created_at', { ascending: false })
          .limit(500);
        const ids = (profs ?? []).map((p: any) => p.id);
        const [{ data: subs }, { data: pacts }, { data: mins }, { data: usersAuth }] = await Promise.all([
          admin.from('subscriptions').select('user_id, is_pro, status, trial_ends_at').in('user_id', ids),
          admin.from('pacts').select('user_id, status').in('user_id', ids),
          admin.from('monthly_call_minutes').select('user_id, minutes_used').in('user_id', ids),
          admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        ]);
        const subMap = new Map((subs ?? []).map((s: any) => [s.user_id, s]));
        const pactMap = new Map<string, number>();
        for (const p of pacts ?? []) pactMap.set(p.user_id, (pactMap.get(p.user_id) || 0) + 1);
        const minMap = new Map<string, number>();
        for (const m of mins ?? []) minMap.set(m.user_id, (minMap.get(m.user_id) || 0) + Number(m.minutes_used || 0));
        const emailMap = new Map((usersAuth?.users ?? []).map((u: any) => [u.id, u.email]));
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
          })),
        });
      }

      case 'pages': {
        const { data } = await admin
          .from('page_views')
          .select('path, duration_ms, session_id, user_id')
          .gte('created_at', since)
          .limit(50000);
        const byPath: Record<string, { views: number; durations: number[]; users: Set<string> }> = {};
        const sessionPaths: Record<string, Set<string>> = {};
        for (const r of data ?? []) {
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

      default:
        return json({ error: 'unknown action' }, 400);
    }
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
