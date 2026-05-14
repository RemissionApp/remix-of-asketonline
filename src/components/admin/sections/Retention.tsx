import React, { useEffect, useState } from 'react';
import { callAdmin } from '../lib';
import { Kpi } from '../charts/Kpi';

export const RetentionSection: React.FC<{ days: number }> = ({ days }) => {
  const [data, setData] = useState<any>(null);
  const [features, setFeatures] = useState<any>(null);
  useEffect(() => {
    callAdmin('retention').then(setData).catch(() => {});
    callAdmin('feature-usage', { days }).then(setFeatures).catch(() => {});
  }, [days]);
  if (!data) return <div className="text-cosmic-secondary">Загрузка…</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Kpi label="D1 retention" value={`${data.d1}%`} hint={`когорта ${data.cohortSizes.d1}`} />
        <Kpi label="D7 retention" value={`${data.d7}%`} hint={`когорта ${data.cohortSizes.d7}`} />
        <Kpi label="D30 retention" value={`${data.d30}%`} hint={`когорта ${data.cohortSizes.d30}`} />
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 overflow-x-auto">
        <div className="text-sm font-medium text-white mb-3">Когорты по неделям регистрации (% возврата)</div>
        <table className="text-xs">
          <thead className="text-cosmic-secondary">
            <tr>
              <th className="text-left px-2 py-1">Неделя</th>
              <th className="text-right px-2 py-1">N</th>
              {[0, 1, 2, 3, 4].map((w) => <th key={w} className="text-right px-2 py-1">W{w}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.cohorts.map((c: any) => (
              <tr key={c.cohort} className="border-t border-white/5">
                <td className="px-2 py-1 text-cosmic-secondary">{c.cohort}</td>
                <td className="px-2 py-1 text-right text-white tabular-nums">{c.total}</td>
                {c.weeks.map((v: number, i: number) => (
                  <td key={i} className="px-2 py-1 text-right tabular-nums" style={{ background: `rgba(167,139,250,${Math.min(v / 100, 1) * 0.4})`, color: v > 0 ? '#fff' : '#64748b' }}>{v}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div className="text-sm font-medium text-white mb-3">Использование фич за период</div>
        {!features && <div className="text-cosmic-secondary text-xs">Загрузка…</div>}
        {features && (
          <div className="space-y-2">
            {features.features.map((f: any) => {
              const max = Math.max(...features.features.map((x: any) => x.users), 1);
              return (
                <div key={f.name} className="flex items-center gap-3">
                  <div className="w-44 text-xs text-cosmic-secondary truncate">{f.name}</div>
                  <div className="flex-1 h-7 bg-white/5 rounded-md overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-gold flex items-center justify-end pr-2 text-xs text-white tabular-nums" style={{ width: `${(f.users / max) * 100}%` }}>
                      {f.users} польз. · {f.events} раз
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};