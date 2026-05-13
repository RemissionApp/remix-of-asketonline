import React, { useEffect, useState } from 'react';
import { callAdmin } from '../lib';
import { Kpi } from '../charts/Kpi';

export const PagesSection: React.FC<{ days: number }> = ({ days }) => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { callAdmin('pages', { days }).then(setData); }, [days]);
  if (!data) return <div className="text-cosmic-secondary">Загрузка…</div>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Kpi label="Сессий" value={data.totalSessions} />
        <Kpi label="Bounce rate" value={`${data.bounceRate}%`} />
      </div>
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-cosmic-secondary text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Страница</th>
              <th className="text-right px-4 py-3">Просмотры</th>
              <th className="text-right px-4 py-3">Уник. юзеров</th>
              <th className="text-right px-4 py-3">Среднее время</th>
            </tr>
          </thead>
          <tbody>
            {data.pages.map((p: any) => (
              <tr key={p.path} className="border-t border-white/5">
                <td className="px-4 py-3 text-white truncate max-w-[280px]">{p.path}</td>
                <td className="px-4 py-3 text-right tabular-nums text-cosmic-secondary">{p.views}</td>
                <td className="px-4 py-3 text-right tabular-nums text-cosmic-secondary">{p.uniqueUsers}</td>
                <td className="px-4 py-3 text-right tabular-nums text-cosmic-secondary">{Math.round(p.avgDurationMs / 1000)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
