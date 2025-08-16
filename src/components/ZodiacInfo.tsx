import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { zodiacData, getZodiacSign } from '@/utils/zodiac';
import { translateElement, translateRuler } from '@/utils/zodiacTranslations';
import { translateTraits } from '@/utils/zodiacTraits';

const ZodiacInfo: React.FC = () => {
  const { userProfile, language } = useAppStore();

  if (!userProfile?.birthDate) return null;

  const zodiacSign = getZodiacSign(userProfile.birthDate);
  if (!zodiacSign) return null;

  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName =
    zodiacInfo.name[language as keyof typeof zodiacInfo.name] ||
    zodiacInfo.name.en;

  // Get translated element and ruler based on language
  const element = translateElement(zodiacInfo.element, language as any);
  const ruler = translateRuler(zodiacInfo.ruler, language as any);

  // Get translated traits
  const traits = translateTraits(zodiacInfo.traits, language as any);

  return (
    <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent">
      <div className="flex items-center mb-3">
        <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
          <span className="text-3xl">{zodiacInfo.symbol}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-cosmic-accent">
            {zodiacName}
          </h3>
          <p className="text-sm text-cosmic-secondary">{zodiacInfo.dates}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-center">
        <div className="space-y-1">
          <p className="text-sm text-cosmic-secondary">
            {language === 'ru'
              ? 'Стихия'
              : language === 'es'
                ? 'Elemento'
                : 'Element'}
            :
          </p>
          <p className="font-medium text-white">{element}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-cosmic-secondary">
            {language === 'ru'
              ? 'Управитель'
              : language === 'es'
                ? 'Regente'
                : 'Ruler'}
            :
          </p>
          <p className="font-medium text-white">{ruler}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-cosmic-secondary mb-2 text-center">
          {language === 'ru'
            ? 'Характеристики'
            : language === 'es'
              ? 'Características'
              : 'Traits'}
          :
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {traits.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-cosmic-accent/20 text-white text-sm rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZodiacInfo;
