import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { callAdmin } from './lib';
import { toast } from 'sonner';

interface Props {
  userId: string | null;
  onClose: () => void;
  onChanged?: () => void;
}

export const UserDetailDialog: React.FC<Props> = ({ userId, onClose, onChanged }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!userId) { setData(null); return; }
    setLoading(true);
    callAdmin('user-detail', { userId }).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [userId]);

  const act = async (type: string, payload: Record<string, unknown> = {}) => {
    if (!userId) return;
    setActing(true);
    try {
      await callAdmin('admin-action', { type, userId, ...payload });
      toast.success('Готово');
      onChanged?.();
      if (type === 'delete_account') onClose();
      else {
        const fresh = await callAdmin('user-detail', { userId });
        setData(fresh);
      }
    } catch (e: any) {
      toast.error(String(e?.message || e));
    } finally {
      setActing(false);
    }
  };

  return (
    <Dialog open={!!userId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl bg-cosmic-dark border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Карточка пользователя</DialogTitle>
        </DialogHeader>
        {loading && <div className="text-cosmic-secondary py-8 text-center">Загрузка…</div>}
        {!loading && data && (
          <div className="space-y-5 text-sm">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="font-medium text-white mb-2">{data.email || userId}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-cosmic-secondary">
                <div>Имя: <span className="text-white">{data.profile?.name || '—'}</span></div>
                <div>Ранг: <span className="text-white">{data.profile?.rank}</span></div>
                <div>⚡ {data.profile?.energy_points}</div>
                <div>Дней: {data.profile?.total_days}</div>
                <div>Trial до: {data.profile?.trial_ends_at ? new Date(data.profile.trial_ends_at).toLocaleDateString() : '—'}</div>
                <div>Создан: {data.profile?.created_at ? new Date(data.profile.created_at).toLocaleDateString() : '—'}</div>
                <div>Подписка: <span className="text-white">{data.subscription?.status || '—'}</span> {data.subscription?.is_pro ? '(Pro)' : ''}</div>
                <div>План: {data.subscription?.price_id || data.subscription?.product_id || '—'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title={`Аскезы (${data.pacts.length})`}>
                {data.pacts.map((p: any) => (
                  <Row key={p.id} left={p.title} right={`${p.status} · ${p.duration}д`} />
                ))}
              </Section>
              <Section title={`Миссии (${data.missions.length})`}>
                {data.missions.map((m: any, i: number) => (
                  <Row key={i} left={m.mission_id} right={m.completed ? '✓' : '…'} />
                ))}
              </Section>
              <Section title={`Звонки по месяцам`}>
                {data.callMinutes.map((m: any) => (
                  <Row key={m.month_year} left={m.month_year} right={`${Math.round(m.minutes_used)} / ${m.minutes_limit} мин`} />
                ))}
              </Section>
              <Section title={`Push (${data.pushSubscriptions.length})`}>
                {data.pushSubscriptions.map((p: any) => (
                  <Row key={p.id} left={new Date(p.created_at).toLocaleDateString()} right={p.is_active ? 'active' : 'off'} />
                ))}
              </Section>
            </div>

            <Section title={`Вопросы Вселенной (${data.questions.length})`}>
              {data.questions.slice(0, 5).map((q: any, i: number) => (
                <div key={i} className="text-xs py-1 border-b border-white/5 last:border-0">
                  <div className="text-white truncate">{q.question}</div>
                  <div className="text-cosmic-secondary truncate">{q.answer}</div>
                </div>
              ))}
            </Section>

            <Section title={`События (${data.events.length})`}>
              <div className="max-h-40 overflow-y-auto">
                {data.events.map((e: any, i: number) => (
                  <Row key={i} left={e.event_name} right={new Date(e.created_at).toLocaleString()} />
                ))}
              </div>
            </Section>

            <Section title={`Последние страницы (${data.pageViews.length})`}>
              <div className="max-h-40 overflow-y-auto">
                {data.pageViews.map((p: any, i: number) => (
                  <Row key={i} left={p.path} right={`${p.platform || '—'} · ${new Date(p.created_at).toLocaleString()}`} />
                ))}
              </div>
            </Section>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="font-medium text-white mb-3">Действия</div>
              <div className="flex flex-wrap gap-2">
                <button disabled={acting} onClick={() => act('grant_pro', { months: 1 })} className="px-3 py-2 rounded-lg bg-cosmic-gold/20 border border-cosmic-gold/30 text-cosmic-gold text-xs disabled:opacity-50">Выдать Pro на 1 мес</button>
                <button disabled={acting} onClick={() => act('grant_pro', { months: 12 })} className="px-3 py-2 rounded-lg bg-cosmic-gold/20 border border-cosmic-gold/30 text-cosmic-gold text-xs disabled:opacity-50">Выдать Pro на год</button>
                <button disabled={acting} onClick={() => act('reset_limits')} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs disabled:opacity-50">Сбросить лимиты</button>
                <button disabled={acting} onClick={() => { if (confirm('Удалить аккаунт навсегда?')) act('delete_account'); }} className="px-3 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs disabled:opacity-50">Удалить аккаунт</button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
    <div className="text-xs uppercase tracking-wider text-cosmic-secondary mb-2">{title}</div>
    {children}
  </div>
);

const Row: React.FC<{ left: string; right: string }> = ({ left, right }) => (
  <div className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0">
    <span className="text-white truncate max-w-[60%]">{left}</span>
    <span className="text-cosmic-secondary">{right}</span>
  </div>
);