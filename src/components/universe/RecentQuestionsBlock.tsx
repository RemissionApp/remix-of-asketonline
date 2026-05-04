import React, { useEffect, useState } from 'react';
import { MessageCircleQuestion, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface QRow {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

export const RecentQuestionsBlock: React.FC = () => {
  const { user, language } = useAppStore();
  const lang = (language as 'ru' | 'en' | 'es') ?? 'ru';
  const [items, setItems] = useState<QRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('universe_questions')
      .select('id,question,answer,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setItems((data as any) || []);
        setLoading(false);
      });
  }, [user?.id]);

  const tr = (ru: string, en: string, es: string) =>
    lang === 'ru' ? ru : lang === 'es' ? es : en;

  const dateStr = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-ES' : 'en-US');

  return (
    <section className="rounded-3xl border border-cosmic-gold/25 bg-gradient-to-br from-cosmic-gold/25 via-cosmic-dark/60 to-cosmic-accent/15 backdrop-blur-md shadow-lg shadow-cosmic-gold/25 p-4">
      <header className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-accent/60 flex items-center justify-center shadow-[0_0_18px_rgba(232,193,108,0.4)]">
            <MessageCircleQuestion size={14} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-sm text-white leading-tight">
              {tr('Последние вопросы', 'Recent questions', 'Preguntas recientes')}
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
          <div className="mx-auto w-12 h-12 rounded-full bg-cosmic-gold/15 flex items-center justify-center mb-2">
            <MessageCircleQuestion size={18} className="text-cosmic-gold" />
          </div>
          <p className="text-xs text-cosmic-secondary leading-relaxed px-4">
            {tr(
              'Задай свой первый вопрос — Вселенная всегда отвечает',
              'Ask your first question — the Universe always answers',
              'Haz tu primera pregunta — el Universo siempre responde'
            )}
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map(q => {
            const open = openId === q.id;
            return (
              <li
                key={q.id}
                className={cn(
                  'rounded-2xl border border-white/10 bg-cosmic-dark/30 backdrop-blur-sm transition-colors',
                  open && 'border-cosmic-gold/40 bg-cosmic-dark/50'
                )}
              >
                <button
                  onClick={() => setOpenId(open ? null : q.id)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/95 truncate font-medium">{q.question}</p>
                    <p className="text-[10px] text-cosmic-secondary mt-0.5">
                      {dateStr(q.created_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full bg-cosmic-gold/15 text-cosmic-gold transition-transform',
                      open && 'rotate-180'
                    )}
                  >
                    <ChevronDown size={13} />
                  </span>
                </button>
                {open && (
                  <div className="px-3 pb-3 pt-1 border-t border-white/5 space-y-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-cosmic-gold/80 mb-1">
                        {tr('Вопрос', 'Question', 'Pregunta')}
                      </p>
                      <p className="text-xs text-white/90 whitespace-pre-line leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-cosmic-accent/80 mb-1">
                        {tr('Ответ Вселенной', 'Universe answer', 'Respuesta del Universo')}
                      </p>
                      <p className="text-xs text-cosmic-secondary/90 whitespace-pre-line leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
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
