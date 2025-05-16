
import React, { useState, useEffect } from 'react';
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

  console.log("HoroscopeContent rendered with:", {
    hasHoroscope: !!horoscope,
    horoscopeDescription: horoscope?.description ? horoscope.description.substring(0, 50) + '...' : 'No description',
    horoscopeSections: horoscope?.sections ? Object.keys(horoscope.sections).join(', ') : 'No sections',
    activeSection
  });

  useEffect(() => {
    // Reset active section when horoscope changes
    if (horoscope) {
      console.log("Horoscope data available, starting with section 0");
      setActiveSection(0);
    }
  }, [horoscope]);

  const handleSectionComplete = () => {
    if (activeSection < 3) {
      console.log(`Section ${activeSection} complete, advancing to section ${activeSection + 1}`);
      setTimeout(() => {
        setActiveSection(activeSection + 1);
      }, 500);
    } else {
      console.log("All sections completed");
    }
  };

  // Safety check - if no horoscope data is available, return empty content
  if (!horoscope) {
    console.log("No horoscope data in HoroscopeContent, returning null");
    return null;
  }

  // If there are no sections, just show the full description
  if (!horoscope.sections) {
    console.log("No sections in horoscope, showing full description");
    return (
      <div className="cosmic-gradient-text text-base font-serif leading-relaxed whitespace-pre-wrap">
        <TypingEffect text={horoscope.description} />
      </div>
    );
  }

  // Define the sections with titles
  const sectionConfig = [
    {
      key: 'work_finance',
      title: translations.workFinance[language] || translations.workFinance.en
    },
    {
      key: 'love_relationships',
      title: translations.loveRelationships[language] || translations.loveRelationships.en
    },
    {
      key: 'health_wellbeing',
      title: translations.healthWellbeing[language] || translations.healthWellbeing.en
    },
    {
      key: 'daily_advice',
      title: translations.dailyAdvice[language] || translations.dailyAdvice.en
    }
  ];

  console.log("Rendering sections:", {
    config: sectionConfig.map(s => s.key),
    availableSections: Object.keys(horoscope.sections || {})
  });

  return (
    <div className="space-y-4">
      {sectionConfig.map((section, index) => {
        const sectionContent = horoscope.sections?.[section.key] || "";
        console.log(`Checking section ${section.key}:`, {
          content: sectionContent.substring(0, 30) + '...',
          length: sectionContent.length,
          shouldRender: activeSection >= index
        });
        
        return (activeSection >= index) && (
          <HoroscopeSection
            key={section.key}
            title={section.title}
            content={sectionContent}
            onComplete={activeSection === index ? handleSectionComplete : undefined}
            className="bg-cosmic-dark/40 border-cosmic-accent/20 backdrop-blur-sm"
          />
        );
      })}
    </div>
  );
};
