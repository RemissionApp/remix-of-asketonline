
import React, { useState } from 'react';
import { TypingEffect } from '@/components/TypingEffect';
import { HoroscopeSection } from './HoroscopeSection';
import { DetailedHoroscope } from '@/types/horoscope';

interface HoroscopeContentProps {
  horoscope: DetailedHoroscope | null;
  translations: any;
  language: string;
}

export const HoroscopeContent: React.FC<HoroscopeContentProps> = ({
  horoscope,
  translations,
  language
}) => {
  const [activeSection, setActiveSection] = useState(0);

  // Safety check - if no horoscope data is available, return empty content
  if (!horoscope) {
    return null;
  }

  const handleSectionComplete = () => {
    if (activeSection < 3) {
      setTimeout(() => {
        setActiveSection(activeSection + 1);
      }, 500);
    }
  };

  // If there are no sections, just show the full description
  if (!horoscope.sections) {
    return (
      <div className="cosmic-gradient-text text-base font-serif leading-relaxed whitespace-pre-wrap">
        <TypingEffect text={horoscope.description} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HoroscopeSection
        title={translations.workFinance[language] || translations.workFinance.en}
        content={horoscope.sections.work_finance}
        onComplete={activeSection === 0 ? handleSectionComplete : undefined}
      />
      
      {activeSection >= 1 && (
        <HoroscopeSection
          title={translations.loveRelationships[language] || translations.loveRelationships.en}
          content={horoscope.sections.love_relationships}
          onComplete={activeSection === 1 ? handleSectionComplete : undefined}
        />
      )}
      
      {activeSection >= 2 && (
        <HoroscopeSection
          title={translations.healthWellbeing[language] || translations.healthWellbeing.en}
          content={horoscope.sections.health_wellbeing}
          onComplete={activeSection === 2 ? handleSectionComplete : undefined}
        />
      )}
      
      {activeSection >= 3 && (
        <HoroscopeSection
          title={translations.dailyAdvice[language] || translations.dailyAdvice.en}
          content={horoscope.sections.daily_advice}
        />
      )}
    </div>
  );
};
