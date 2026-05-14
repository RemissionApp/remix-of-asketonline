import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { callAdmin } from '../lib';
import { Kpi } from '../charts/Kpi';

export const RevenueSection: React.FC<{ days: number }> = ({ days }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    callAdmin('revenue', { days }).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [days]);
  if (loading) return <div className="text-cosmic-secondary">Загрузка…</div>;
  if (!data) return <div className="text-rose-300">Не удалось загрузить</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="MRR" value={`$${data.mrr}`} hint={`ARPU $${data.arpu}`} />
        <Kpi label="Активные Pro" value={data.activePro} hint={`+${data.newPaid} за период`} />
        <Kpi label="На триале" value={data.trialing} hint={`${data.trialConversion}% trial→paid`} />
        <Kpi label="Отмена / Past due" value={`${data.cancelled} / ${data.pastDue}`} />
      </div>
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
        <div className="text-sm font-medium text-white mb-4">Выручка по дням, $</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Line type="monotone" dataKey="amount" stroke="#fbbf24" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="text-sm font-medium text-white mb-3">Разбивка по тарифам</div>
          {data.planBreakdown.length === 0 && <div className="text-cosmic-secondary text-xs">Нет активных подписок</div>}
          {data.planBreakdown.map((p: any) => (
            <div key={p.plan} className="flex justify-between py-1 text-sm">
              <span className="text-cosmic-secondary truncate">{p.plan}</span>
              <span className="text-white tabular-nums">{p.count}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="text-sm font-medium text-white mb-3">Свежие подписки</div>
          <div className="space-y-1 max-h-64 overflow-auto">
            {data.recent.slice(0, 12).map((r: any) => (
              <div key={r.user_id + r.subscription_start} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                <span className="truncate text-white max-w-[180px]">{r.email || r.user_id.slice(0, 8)}</span>
                <span className="text-cosmic-secondary">{r.plan}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${r.cancel_at_period_end ? 'bg-rose-500/20 text-rose-300' : r.status === 'past_due' ? 'bg-orange-500/20 text-orange-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{r.cancel_at_period_end ? 'cancelling' : r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};