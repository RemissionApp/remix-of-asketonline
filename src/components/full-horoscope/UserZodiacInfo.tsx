import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { zodiacData, ZodiacSign } from '@/utils/zodiac';
import { Star, Calendar } from 'lucide-react';
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
  uiText,
}) => {
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  const element = translateElement(zodiacInfo.element, language as any);
  const ruler = translateRuler(zodiacInfo.ruler, language as any);
  const traits = translateTraits(zodiacInfo.traits, language as any);

  const formattedDate = new Date(birthDate).toLocaleDateString(
    language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const elementLabel = language === 'ru' ? 'Стихия' : language === 'es' ? 'Elemento' : 'Element';
  const rulerLabel = language === 'ru' ? 'Управитель' : language === 'es' ? 'Regente' : 'Ruler';
  const traitsLabel =
    language === 'ru' ? 'Характеристики' : language === 'es' ? 'Características' : 'Traits';

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardContent className="p-6 space-y-5">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl" title={zodiacName}>
              {zodiacInfo.symbol}
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">
                {userName ? `${userName} — ${zodiacName}` : zodiacName}
              </h2>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{zodiacInfo.dates}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 mt-0.5">
                <span className="text-xs">{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/70">
            <Star className="h-4 w-4" />
            <span className="text-sm">{uiText.personalizedReading}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <p className="text-xs text-white/60">{elementLabel}</p>
            <p className="font-medium text-white mt-1">{element}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <p className="text-xs text-white/60">{rulerLabel}</p>
            <p className="font-medium text-white mt-1">{ruler}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-2 text-center">{traitsLabel}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {traits.map((trait, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 border border-white/15 text-white text-sm rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
