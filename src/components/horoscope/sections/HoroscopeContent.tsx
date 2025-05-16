
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

  // Define the emojis and titles based on language
  const sectionConfig = [
    {
      emoji: '💼',
      key: 'work_finance',
      title: translations.workFinance[language] || translations.workFinance.en
    },
    {
      emoji: '❤️',
      key: 'love_relationships',
      title: translations.loveRelationships[language] || translations.loveRelationships.en
    },
    {
      emoji: '🧘‍♂️',
      key: 'health_wellbeing',
      title: translations.healthWellbeing[language] || translations.healthWellbeing.en
    },
    {
      emoji: '✨',
      key: 'daily_advice',
      title: translations.dailyAdvice[language] || translations.dailyAdvice.en
    }
  ];

  return (
    <div className="space-y-4">
      {sectionConfig.map((section, index) => (
        (activeSection >= index) && (
          <HoroscopeSection
            key={section.key}
            title={`${section.emoji} ${section.title}`}
            content={horoscope.sections[section.key] || ""}
            onComplete={activeSection === index ? handleSectionComplete : undefined}
            className="bg-cosmic-dark/40 border-cosmic-accent/20 backdrop-blur-sm"
          />
        )
      ))}
    </div>
  );
};
