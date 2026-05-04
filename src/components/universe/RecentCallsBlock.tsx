import React, { useEffect, useState } from 'react';
import { Phone, ChevronDown, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface CallRow {
  id: string;
  summary: string | null;
  duration_seconds: number | null;
  emotional_tone: string | null;
  key_topics: string[] | null;
  called_at: string;
}

const formatRel = (iso: string, lang: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  const days = Math.floor(diff / day);
  if (days <= 0) return lang === 'ru' ? 'сегодня' : lang === 'es' ? 'hoy' : 'today';
  if (days === 1) return lang === 'ru' ? 'вчера' : lang === 'es' ? 'ayer' : 'yesterday';
  if (days < 7) return lang === 'ru' ? `${days} дн. назад` : lang === 'es' ? `hace ${days} d` : `${days}d ago`;
  return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-ES' : 'en-US');
};

const formatDur = (s: number | null) => {
  if (!s) return '';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export const RecentCallsBlock: React.FC = () => {
  const { user, language } = useAppStore();
  const lang = (language as 'ru' | 'en' | 'es') ?? 'ru';
  const [items, setItems] = useState<CallRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('call_summaries')
      .select('id,summary,duration_seconds,emotional_tone,key_topics,called_at')
      .eq('user_id', user.id)
      .order('called_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setItems((data as any) || []);
        setLoading(false);
      });
  }, [user?.id]);

  const tr = (ru: string, en: string, es: string) =>
    lang === 'ru' ? ru : lang === 'es' ? es : en;

  return (
    <section className="rounded-3xl border border-cosmic-accent/25 bg-gradient-to-br from-cosmic-indigo/40 via-cosmic-dark/60 to-cosmic-accent/30 backdrop-blur-md shadow-lg shadow-cosmic-accent/30 p-4">
      <header className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-indigo flex items-center justify-center shadow-[0_0_18px_rgba(139,92,246,0.45)]">
            <Phone size={14} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-sm text-white leading-tight">
              {tr('Последние разговоры', 'Recent calls', 'Llamadas recientes')}
            </h3>
            {items.length > 0 && (
              <p className="text-[10px] text-cosmic-secondary mt-0.5">
                {items.length} {tr(
                  items.length === 1 ? 'запись' : 'записей',
                  items.length === 1 ? 'entry' : 'entries',
                  items.length === 1 ? 'entrada' : 'entradas'
                )}
              </p>
            )}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="text-center text-xs text-cosmic-secondary py-4">…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-cosmic-accent/15 flex items-center justify-center mb-2">
            <Phone size={18} className="text-cosmic-accent" />
          </div>
          <p className="text-xs text-cosmic-secondary leading-relaxed px-4">
            {tr(
              'Твой первый разговор с Вселенной изменит многое',
              'Your first conversation with the Universe will change everything',
              'Tu primera conversación con el Universo lo cambiará todo'
            )}
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map(c => {
            const open = openId === c.id;
            const title =
              (c.summary || '').split('\n')[0].slice(0, 80) ||
              tr('Без названия', 'Untitled', 'Sin título');
            return (
              <li
                key={c.id}
                className={cn(
                  'rounded-2xl border border-white/10 bg-cosmic-dark/30 backdrop-blur-sm transition-colors',
                  open && 'border-cosmic-accent/40 bg-cosmic-dark/50'
                )}
              >
                <button
                  onClick={() => setOpenId(open ? null : c.id)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/95 truncate font-medium">{title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-cosmic-secondary mt-0.5">
                      <span>{formatRel(c.called_at, lang)}</span>
                      {c.duration_seconds ? (
                        <span className="flex items-center gap-0.5">
                          <Clock size={9} /> {formatDur(c.duration_seconds)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full bg-cosmic-accent/15 text-cosmic-accent transition-transform',
                      open && 'rotate-180'
                    )}
                  >
                    <ChevronDown size={13} />
                  </span>
                </button>
                {open && c.summary && (
                  <div className="px-3 pb-3 pt-1 border-t border-white/5">
                    <p className="text-xs text-cosmic-secondary/90 whitespace-pre-line leading-relaxed">
                      {c.summary}
                    </p>
                    {c.key_topics && c.key_topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.key_topics.map((k, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-cosmic-accent/15 text-cosmic-accent border border-cosmic-accent/25"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
