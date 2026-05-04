import React from 'react';
import { zodiacData, ZodiacSign } from '@/utils/zodiac';
import { translateElement, translateRuler } from '@/utils/zodiacTranslations';
import { translateTraits } from '@/utils/zodiacTraits';

interface UserZodiacInfoProps {
  zodiacSign: ZodiacSign;
  birthDate: string;
  userName: string | null;
  language: string;
  uiText: any;
}

export const UserZodiacInfo: React.FC<UserZodiacInfoProps> = ({
  zodiacSign,
  birthDate,
  userName,
  language,
}) => {
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  const element = translateElement(zodiacInfo.element, language as any);
  const ruler = translateRuler(zodiacInfo.ruler, language as any);
  const traits = translateTraits(zodiacInfo.traits, language as any);

  const elementLabel = language === 'ru' ? 'Стихия' : language === 'es' ? 'Elemento' : 'Element';
  const rulerLabel = language === 'ru' ? 'Управитель' : language === 'es' ? 'Regente' : 'Ruler';
  const traitsLabel =
    language === 'ru' ? 'Характеристики' : language === 'es' ? 'Características' : 'Traits';

  return (
    <div className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-500/30 via-cosmic-dark/60 to-violet-500/10 p-4 shadow-lg shadow-violet-500/30">
      <div className="flex items-center gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600/70 shadow-[0_0_24px_rgba(139,92,246,0.55)]">
          <span className="text-2xl">{zodiacInfo.symbol}</span>
        </div>
        <div className="flex-1 min-w-0 text-center">
          <div className={`text-base font-semibold text-white ${language === 'en' ? 'font-serif' : ''}`}>
            {userName ? `${userName} — ${zodiacName}` : zodiacName}
          </div>
          <div className="mt-0.5 text-[11px] text-cosmic-secondary">{zodiacInfo.dates}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-center">
          <p className="text-[10px] text-white/60">{elementLabel}</p>
          <p className="text-xs font-medium text-white mt-0.5">{element}</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-center">
          <p className="text-[10px] text-white/60">{rulerLabel}</p>
          <p className="text-xs font-medium text-white mt-0.5">{ruler}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[10px] text-white/60 mb-1.5 text-center">{traitsLabel}</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {traits.map((trait, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-white/10 border border-white/15 text-white text-[11px] rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
