import React, { useEffect, useState } from 'react';
import { callAdmin } from '../lib';

export const EventsSection: React.FC<{ days: number }> = ({ days }) => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { callAdmin('events', { days }).then(setData); }, [days]);
  if (!data) return <div className="text-cosmic-secondary">Загрузка…</div>;
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-cosmic-secondary text-xs uppercase tracking-wider">
          <tr><th className="text-left px-4 py-3">Событие</th><th className="text-right px-4 py-3">Кол-во</th></tr>
        </thead>
        <tbody>
          {data.events.length === 0 && <tr><td colSpan={2} className="px-4 py-6 text-center text-cosmic-secondary">Пока событий нет</td></tr>}
          {data.events.map((e: any) => (
            <tr key={e.name} className="border-t border-white/5"><td className="px-4 py-3 text-white">{e.name}</td><td className="px-4 py-3 text-right tabular-nums text-cosmic-gold">{e.count}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
