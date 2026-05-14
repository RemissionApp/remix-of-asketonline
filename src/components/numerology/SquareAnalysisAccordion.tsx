import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { PythagoreanSquare, CellStrength } from '@/utils/numerology/calculations';
import { getCellStrength } from '@/utils/numerology/calculations';
import {
  SQUARE_CELL_LABELS,
  SQUARE_CELL_MEANINGS,
  pickI18n,
} from '@/utils/numerology/interpretations';
import { useAppStore } from '@/store/useAppStore';
import type { Lang } from '@/utils/numerology/interpretations';
import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  square: PythagoreanSquare;
}

const STRENGTH_COLOR: Record<CellStrength, string> = {
  absent: 'bg-muted/20 text-cosmic-secondary',
  weak: 'bg-cosmic-accent/15 text-foreground',
  medium: 'bg-cosmic-accent/30 text-foreground',
  strong: 'bg-cosmic-gold/30 text-foreground',
  very_strong: 'bg-cosmic-gold/50 text-foreground',
};

export const SquareAnalysisAccordion: React.FC<Props> = ({ square }) => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  const lang = (language as Lang) ?? 'en';
  const v2 = t.numerology.v2!;

  const levelLabel = (s: CellStrength): string => {
    const map: Record<CellStrength, string> = {
      absent: v2.square.levels.absent,
      weak: v2.square.levels.weak,
      medium: v2.square.levels.normal,
      strong: v2.square.levels.strong,
      very_strong: v2.square.levels.excessive,
    };
    return map[s];
  };

  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        const count = square.cells[String(n)] ?? 0;
        const strength = getCellStrength(count);
        const label = pickI18n(SQUARE_CELL_LABELS[n], lang);
        const desc = pickI18n(SQUARE_CELL_MEANINGS[n][strength], lang);
        return (
          <Accordion key={n} type="single" collapsible>
            <AccordionItem value={`sq-${n}`} className="border-white/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm border border-white/15 ${STRENGTH_COLOR[strength]}`}>
                      {count > 0 ? String(n).repeat(Math.min(count, 3)) : '·'}
                    </div>
                    <div className="text-left">
                      <p className="text-foreground text-sm">{label}</p>
                      <p className="text-cosmic-secondary text-xs">{levelLabel(strength)} · {count}</p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-cosmic-secondary text-sm leading-relaxed pt-1">
                  {desc}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};

export default SquareAnalysisAccordion;