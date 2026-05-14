import React, { useState } from 'react';
import { Book, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnswersBook } from '@/hooks/useAnswersBook';
import { useTranslations } from '@/hooks/useTranslations';

export const AnswersBookList: React.FC = () => {
  const { items, remove } = useAnswersBook();
  const { t } = useTranslations();
  const v2 = t.numerology.v2!;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <Book className="w-4 h-4 text-cosmic-gold" />
        <h3 className="text-cosmic-gold font-serif text-base">{v2.answersBook.title}</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-cosmic-secondary text-sm text-center py-4">
          {v2.answersBook.empty}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => {
            const open = openId === it.id;
            return (
              <li
                key={it.id}
                className="rounded-2xl border border-white/10 bg-cosmic-dark/60"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : it.id)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{it.title}</p>
                    <p className="text-[10px] text-cosmic-secondary mt-0.5">
                      {v2.answersBook.savedAt}: {new Date(it.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-cosmic-secondary transition-transform shrink-0',
                      open && 'rotate-180'
                    )}
                  />
                </button>
                {open && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="text-cosmic-secondary text-sm whitespace-pre-wrap leading-relaxed">
                      {it.content}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      className="inline-flex items-center gap-1 text-xs text-destructive hover:opacity-80"
                    >
                      <Trash2 className="w-3 h-3" />
                      {v2.answersBook.delete}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
