
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
    sectionValues: horoscope?.sections ? 
      Object.entries(horoscope.sections).map(([key, value]) => 
        `${key}: ${value ? (value.substring(0, 20) + '...') : 'missing'}`
      ) : 
      [],
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
    if (activeSection < 4) {
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
      key: 'general_atmosphere',
      title: language === 'ru' ? 'Общая атмосфера дня' : 'General Day Atmosphere'
    },
    {
      key: 'work_finance',
      title: language === 'ru' ? 'Советы по работе и финансам' : 'Work & Finance Advice'
    },
    {
      key: 'love_relationships',
      title: language === 'ru' ? 'Рекомендации по отношениям и любви' : 'Love & Relationship Recommendations'
    },
    {
      key: 'health_wellbeing',
      title: language === 'ru' ? 'Состояние здоровья и эмоционального баланса' : 'Health & Emotional Balance'
    },
    {
      key: 'daily_advice',
      title: language === 'ru' ? 'Практичный совет дня' : 'Practical Daily Advice'
    }
  ];

  console.log("Rendering sections:", {
    config: sectionConfig.map(s => s.key),
    availableSections: Object.keys(horoscope.sections || {}),
    sectionContents: Object.entries(horoscope.sections || {}).map(([key, value]) => 
      `${key}: ${value ? 'present' : 'missing'}`
    )
  });

  return (
    <div className="space-y-4">
      {sectionConfig.map((section, index) => {
        const sectionContent = horoscope.sections?.[section.key] || "";
        console.log(`Section ${section.key}:`, {
          content: sectionContent ? (sectionContent.substring(0, 30) + '...') : 'No content',
          length: sectionContent?.length || 0,
          shouldRender: activeSection >= index
        });
        
        // Only display the section if we have content
        if (!sectionContent) {
          console.log(`Skipping section ${section.key} because content is empty`);
          return null;
        }
        
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
      
      {/* Debug section to show raw content */}
      {Object.keys(horoscope.sections || {}).length === 0 && (
        <div className="p-4 bg-red-900/20 border border-red-500/40 rounded-md">
          <h3 className="text-red-400 font-bold mb-2">Debug: No horoscope sections found</h3>
          <pre className="text-xs overflow-auto max-h-40 p-2 bg-black/30 rounded">
            {JSON.stringify(horoscope, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
