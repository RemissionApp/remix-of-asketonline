import React, { useEffect, useState } from 'react';
import { callAdmin } from '../lib';
import { Kpi } from '../charts/Kpi';

export const HealthSection: React.FC = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { callAdmin('health').then(setData).catch(() => {}); }, []);
  if (!data) return <div className="text-cosmic-secondary">Загрузка…</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Kpi label="Проблемные подписки" value={data.problemSubs.length} hint="past_due / incomplete / unpaid" />
        <Kpi label="Активные push" value={data.pushActive} hint={`${data.pushInactive} отключено`} />
        <Kpi label="Stripe events (20 последних)" value={data.recentStripeEvents.length} />
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="px-4 py-3 text-sm font-medium text-white border-b border-white/10">Подписки, требующие внимания</div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-cosmic-secondary text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Статус</th>
              <th className="text-left px-4 py-2">План</th>
              <th className="text-left px-4 py-2">Period end</th>
            </tr>
          </thead>
          <tbody>
            {data.problemSubs.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-cosmic-secondary">Всё в порядке</td></tr>}
            {data.problemSubs.map((s: any) => (
              <tr key={s.user_id} className="border-t border-white/5">
                <td className="px-4 py-2 text-white truncate max-w-[220px]">{s.email || s.user_id.slice(0, 8)}</td>
                <td className="px-4 py-2"><span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">{s.status}</span></td>
                <td className="px-4 py-2 text-cosmic-secondary">{s.price_id || s.product_id}</td>
                <td className="px-4 py-2 text-cosmic-secondary">{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="px-4 py-3 text-sm font-medium text-white border-b border-white/10">Последние Stripe-события</div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-cosmic-secondary text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-2">Тип</th>
              <th className="text-left px-4 py-2">Среда</th>
              <th className="text-left px-4 py-2">Время</th>
              <th className="text-left px-4 py-2">Event ID</th>
            </tr>
          </thead>
          <tbody>
            {data.recentStripeEvents.map((e: any) => (
              <tr key={e.event_id} className="border-t border-white/5">
                <td className="px-4 py-2 text-white">{e.type}</td>
                <td className="px-4 py-2 text-cosmic-secondary">{e.environment}</td>
                <td className="px-4 py-2 text-cosmic-secondary">{new Date(e.processed_at).toLocaleString()}</td>
                <td className="px-4 py-2 text-cosmic-secondary text-xs truncate max-w-[200px]">{e.event_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};