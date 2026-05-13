import React, { useEffect, useState } from 'react';
import { callAdmin } from '../lib';

export const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    callAdmin('users').then((d) => { setUsers(d.users || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  const filtered = users.filter((u) =>
    !q ||
    (u.email || '').toLowerCase().includes(q.toLowerCase()) ||
    (u.name || '').toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск по email / имени"
        className="w-full max-w-md rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-cosmic-secondary outline-none focus:border-cosmic-accent/50"
      />
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-cosmic-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Имя</th>
                <th className="text-left px-4 py-3">Регистрация</th>
                <th className="text-left px-4 py-3">Подписка</th>
                <th className="text-right px-4 py-3">Дней</th>
                <th className="text-right px-4 py-3">⚡</th>
                <th className="text-right px-4 py-3">Аскезы</th>
                <th className="text-right px-4 py-3">Минут</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="px-4 py-6 text-center text-cosmic-secondary">Загрузка…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-6 text-center text-cosmic-secondary">Нет данных</td></tr>}
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white truncate max-w-[220px]">{u.email || '—'}</td>
                  <td className="px-4 py-3 text-white truncate max-w-[160px]">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-cosmic-secondary">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.subscription?.is_pro ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/30">Pro</span>
                    ) : u.subscription?.status === 'trialing' ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-cosmic-accent/20 text-cosmic-accent border border-cosmic-accent/30">Trial</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-cosmic-secondary border border-white/15">Free</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-cosmic-secondary tabular-nums">{u.totalDays}</td>
                  <td className="px-4 py-3 text-right text-cosmic-gold tabular-nums">{u.energyPoints}</td>
                  <td className="px-4 py-3 text-right text-cosmic-secondary tabular-nums">{u.pactsCount}</td>
                  <td className="px-4 py-3 text-right text-cosmic-secondary tabular-nums">{u.callMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-xs text-cosmic-secondary">{filtered.length} из {users.length}</div>
    </div>
  );
};
