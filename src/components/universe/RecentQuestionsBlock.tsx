import React, { useEffect, useState } from 'react';
import { MessageCircleQuestion, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';

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
      .limit(5)
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
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-gold/15 via-cosmic-dark/60 to-cosmic-accent/10 backdrop-blur-md shadow-lg shadow-cosmic-gold/10 p-4">
      <header className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-accent flex items-center justify-center">
          <MessageCircleQuestion size={14} className="text-white" />
        </div>
        <h3 className="font-serif text-sm text-white">
          {tr('Последние вопросы', 'Recent questions', 'Preguntas recientes')}
        </h3>
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
        <ul className="space-y-2">
          {items.map(q => {
            const open = openId === q.id;
            return (
              <li key={q.id} className="rounded-2xl border border-white/5 bg-cosmic-dark/40">
                <button
                  onClick={() => setOpenId(open ? null : q.id)}
                  className="w-full text-left p-3 flex items-start gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/90 line-clamp-2">{q.question}</p>
                    <p className="text-[10px] text-cosmic-secondary mt-1">{dateStr(q.created_at)}</p>
                  </div>
                  {open ? <ChevronUp size={14} className="text-cosmic-secondary mt-1" /> : <ChevronDown size={14} className="text-cosmic-secondary mt-1" />}
                </button>
                {open && (
                  <div className="px-3 pb-3 border-t border-white/5 pt-2">
                    <p className="text-xs text-cosmic-secondary whitespace-pre-line">{q.answer}</p>
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