import React, { useEffect, useState } from 'react';
import { callAdmin } from '../lib';

const PRESETS: { name: string; steps: string[] }[] = [
  { name: 'Регистрация → Онбординг → Первый звонок', steps: ['signup_completed', 'onboarding_completed', 'call_started'] },
  { name: 'Регистрация → Первая аскеза', steps: ['signup_completed', 'pact_created'] },
  { name: 'Pro экран → Подписка', steps: ['pro_screen_viewed', 'pro_purchased'] },
];

export const FunnelsSection: React.FC<{ days: number }> = ({ days }) => {
  const [results, setResults] = useState<Record<string, any[]>>({});
  useEffect(() => {
    Promise.all(PRESETS.map((p) => callAdmin('funnel', { days, steps: p.steps }).then((r) => [p.name, r.funnel] as const)))
      .then((entries) => setResults(Object.fromEntries(entries)))
      .catch(() => {});
  }, [days]);
  return (
    <div className="space-y-6">
      {PRESETS.map((p) => {
        const f = results[p.name];
        const max = f && f.length ? Math.max(...f.map((x: any) => x.users), 1) : 1;
        return (
          <div key={p.name} className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
            <div className="text-sm font-medium text-white mb-3">{p.name}</div>
            <div className="space-y-2">
              {(f ?? []).map((s: any, i: number) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-44 text-xs text-cosmic-secondary truncate">{i + 1}. {s.step}</div>
                  <div className="flex-1 h-7 bg-white/5 rounded-md overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-gold flex items-center justify-end pr-2 text-xs text-white" style={{ width: `${(s.users / max) * 100}%` }}>
                      {s.users}
                    </div>
                  </div>
                </div>
              ))}
              {!f && <div className="text-xs text-cosmic-secondary">Загрузка…</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
