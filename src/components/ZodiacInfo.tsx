
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { useTranslations } from '@/hooks/useTranslations';

export const ZodiacInfo: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  const birthDate = userProfile?.birthDate;
  const zodiacSign = getZodiacSign(birthDate || null);
  
  if (!zodiacSign) return null;
  
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  
  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl text-cosmic-accent">{zodiacInfo.symbol}</div>
        <div>
          <h3 className="text-white font-medium">{zodiacName}</h3>
          <p className="text-sm text-cosmic-secondary">{zodiacInfo.dates}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-cosmic-secondary">Element:</span>
          <span className="text-white ml-2">{zodiacInfo.element}</span>
        </div>
        <div>
          <span className="text-cosmic-secondary">Ruler:</span>
          <span className="text-white ml-2">{zodiacInfo.ruler}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-cosmic-secondary mb-1">Traits:</div>
        <div className="flex flex-wrap gap-2">
          {zodiacInfo.traits.map(trait => (
            <span 
              key={trait} 
              className="bg-cosmic-accent/20 text-white px-2 py-1 rounded-full text-xs"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
