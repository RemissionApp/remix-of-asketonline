import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  NUMBER_MEANINGS,
  pickI18n,
  pickI18nList,
  type PythagoreanLifePathBlock,
} from '@/utils/numerology/interpretations';
import {
  NUMBER_PLANETS,
  NUMBER_ELEMENTS,
  NUMBER_ZODIAC,
  NUMBER_COLORS,
  PLANET_SYMBOLS,
  TAROT_ARCANA,
} from '@/utils/numerology/astroLinks';
import type { Lang } from '@/utils/numerology/interpretations';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  number: number;
  context: 'lifePath' | 'soul' | 'personality' | 'expression' | 'chaldean';
  label: string;
}

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-cosmic-gold/10 text-cosmic-gold border border-cosmic-gold/30">
    {children}
  </span>
);

export const NumberDetailAccordion: React.FC<Props> = ({ number, context, label }) => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  const lang = (language as Lang) ?? 'en';
  const v2 = t.numerology.v2!;

  const meaning = NUMBER_MEANINGS[number] ?? NUMBER_MEANINGS[1];
  const planet = NUMBER_PLANETS[number];
  const element = NUMBER_ELEMENTS[number];
  const zodiac = NUMBER_ZODIAC[number] ?? [];
  const colors = NUMBER_COLORS[number] ?? ['#888', '#aaa'];
  const arcana = TAROT_ARCANA[number] ?? null;

  const block =
    context === 'lifePath'
      ? meaning.pythagorean.lifePath
      : context === 'chaldean'
      ? meaning.chaldean.single
      : meaning.pythagorean[context];

  const isFull = context === 'lifePath';
  const fullBlock = isFull ? (block as PythagoreanLifePathBlock) : null;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`n-${number}-${context}`} className="border-white/10">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10 flex items-center justify-center font-serif text-lg text-foreground">
              {number}
            </div>
            <div>
              <p className="text-foreground text-sm">{label}</p>
              <p className="text-cosmic-secondary text-xs">{pickI18n(block.title, lang)}</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-2">
              {planet && <Pill>{PLANET_SYMBOLS[planet]} {v2.sections.planet}: {planet}</Pill>}
              {element && <Pill>{v2.sections.element}: {element}</Pill>}
              {zodiac.length > 0 && <Pill>{v2.sections.zodiac}: {zodiac.join(' · ')}</Pill>}
              {arcana && <Pill>{v2.sections.arcana}: {pickI18n(arcana.name, lang)}</Pill>}
            </div>

            <p className="text-cosmic-secondary text-sm leading-relaxed">
              {pickI18n(block.essence, lang)}
            </p>

            {isFull && fullBlock && (
              <>
                <Section title={v2.sections.gifts}>
                  <List items={pickI18nList(fullBlock.gifts, lang)} />
                </Section>
                <Section title={v2.sections.challenges}>
                  <List items={pickI18nList(fullBlock.challenges, lang)} />
                </Section>
                <Section title={v2.sections.mission}>
                  <p className="text-cosmic-secondary text-sm leading-relaxed">
                    {pickI18n(fullBlock.mission, lang)}
                  </p>
                </Section>
                <Section title={v2.sections.shadow}>
                  <p className="text-cosmic-secondary text-sm leading-relaxed">
                    {pickI18n(fullBlock.shadow, lang)}
                  </p>
                </Section>
                <Section title={v2.sections.affirmation}>
                  <p className="italic text-cosmic-gold text-sm leading-relaxed">
                    «{pickI18n(fullBlock.affirmation, lang)}»
                  </p>
                </Section>
              </>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Section title={v2.sections.colors}>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </Section>
              <Section title={v2.sections.luckyDay}>
                <p className="text-cosmic-secondary">{pickI18n(meaning.luckyDay, lang)}</p>
              </Section>
              <Section title={v2.sections.crystals}>
                <p className="text-cosmic-secondary">{pickI18nList(meaning.crystals, lang).join(', ')}</p>
              </Section>
              <Section title={v2.sections.luckyNumbers}>
                <p className="text-cosmic-secondary">{meaning.luckyNumbers.join(', ')}</p>
              </Section>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-cosmic-gold text-xs uppercase tracking-wider mb-1">{title}</h4>
    {children}
  </div>
);

const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc pl-4 space-y-1 text-cosmic-secondary text-sm">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

export default NumberDetailAccordion;