import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { callAdmin } from '../lib';
import { Kpi } from '../charts/Kpi';

export const OverviewSection: React.FC<{ days: number }> = ({ days }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    callAdmin('overview', { days }).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);
  if (loading) return <div className="text-cosmic-secondary">Загрузка…</div>;
  if (!data) return <div className="text-rose-300">Не удалось загрузить</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Всего пользователей" value={data.totalUsers} />
        <Kpi label={`Новых за ${days}д`} value={data.newUsers} />
        <Kpi label="DAU / WAU" value={`${data.dau} / ${data.wau}`} />
        <Kpi label="Подписчики Pro" value={data.proCount} hint={`${data.conversionRate}% конверсия`} />
      </div>
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
        <div className="text-sm font-medium text-white mb-4">Регистрации по дням</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Kpi label="Минут звонков всего" value={data.totalCallMinutes} />
        <Kpi label="MAU" value={data.mau} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="text-sm font-medium text-white mb-3">Устройства</div>
          {(data.platforms || []).map((p: any) => (
            <div key={p.name} className="flex justify-between text-xs py-1">
              <span className="text-cosmic-secondary">{p.name}</span>
              <span className="text-white tabular-nums">{p.count}</span>
            </div>
          ))}
          {(!data.platforms || data.platforms.length === 0) && <div className="text-xs text-cosmic-secondary">Нет данных</div>}
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="text-sm font-medium text-white mb-3">Источники трафика (top 10)</div>
          {(data.referrers || []).map((p: any) => (
            <div key={p.name} className="flex justify-between text-xs py-1">
              <span className="text-cosmic-secondary truncate max-w-[70%]">{p.name}</span>
              <span className="text-white tabular-nums">{p.count}</span>
            </div>
          ))}
          {(!data.referrers || data.referrers.length === 0) && <div className="text-xs text-cosmic-secondary">Нет данных</div>}
        </div>
      </div>
    </div>
  );
};
