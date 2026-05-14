import React, { useEffect, useState } from 'react';
import { callAdmin } from '../lib';
import { UserDetailDialog } from '../UserDetailDialog';

export const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    callAdmin('users').then((d) => { setUsers(d.users || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  const filtered = users.filter((u) =>
    !q ||
    (u.email || '').toLowerCase().includes(q.toLowerCase()) ||
    (u.name || '').toLowerCase().includes(q.toLowerCase()),
  );
  const exportCsv = () => {
    const header = ['email', 'name', 'created_at', 'subscription', 'last_seen', 'days', 'energy', 'pacts', 'minutes'];
    const rows = filtered.map((u) => [
      u.email || '', u.name || '', u.created_at,
      u.subscription?.is_pro ? 'pro' : (u.subscription?.status || 'free'),
      u.lastSeen || '', u.totalDays, u.energyPoints, u.pactsCount, u.callMinutes,
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = `asceta-users-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по email / имени"
          className="flex-1 min-w-[200px] max-w-md rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-cosmic-secondary outline-none focus:border-cosmic-accent/50"
        />
        <button onClick={exportCsv} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white">Экспорт CSV</button>
      </div>
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-cosmic-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Имя</th>
                <th className="text-left px-4 py-3">Регистрация</th>
                <th className="text-left px-4 py-3">Последний визит</th>
                <th className="text-left px-4 py-3">Подписка</th>
                <th className="text-right px-4 py-3">Дней</th>
                <th className="text-right px-4 py-3">⚡</th>
                <th className="text-right px-4 py-3">Аскезы</th>
                <th className="text-right px-4 py-3">Минут</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} className="px-4 py-6 text-center text-cosmic-secondary">Загрузка…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-6 text-center text-cosmic-secondary">Нет данных</td></tr>}
              {filtered.map((u) => (
                <tr key={u.id} onClick={() => setSelected(u.id)} className="border-t border-white/5 hover:bg-white/[0.05] cursor-pointer">
                  <td className="px-4 py-3 text-white truncate max-w-[220px]">{u.email || '—'}</td>
                  <td className="px-4 py-3 text-white truncate max-w-[160px]">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-cosmic-secondary">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-cosmic-secondary">{u.lastSeen ? new Date(u.lastSeen).toLocaleDateString() : '—'}</td>
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
      <UserDetailDialog userId={selected} onClose={() => setSelected(null)} onChanged={() => {
        callAdmin('users').then((d) => setUsers(d.users || []));
      }} />
    </div>
  );
};
