
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
  const [sectionsLoaded, setSectionsLoaded] = useState(false);

  // Улучшенное логирование с информацией о секциях и их содержимом
  console.log("HoroscopeContent rendered with:", {
    hasHoroscope: !!horoscope,
    horoscopeDescription: horoscope?.description ? horoscope.description.substring(0, 50) + '...' : 'No description',
    horoscopeSections: horoscope?.sections ? Object.keys(horoscope.sections).join(', ') : 'No sections',
    sectionsDetails: horoscope?.sections ? 
      Object.entries(horoscope.sections).map(([key, value]) => ({
        key,
        hasValue: !!value,
        length: value?.length || 0,
        preview: value ? value.substring(0, 30) + '...' : 'missing'
      })) : 
      [],
    activeSection
  });

  useEffect(() => {
    // Reset active section when horoscope changes
    if (horoscope) {
      console.log("Horoscope data available, starting with section 0");
      setActiveSection(0);
      
      // Verify sections content
      if (horoscope.sections) {
        const hasSections = Object.values(horoscope.sections).some(section => !!section && section.length > 0);
        setSectionsLoaded(hasSections);
        console.log("Sections loaded check:", { hasSections });
        
        if (!hasSections) {
          console.error("Horoscope sections are empty or missing", horoscope.sections);
        }
      } else {
        setSectionsLoaded(false);
        console.error("No sections object in horoscope data");
      }
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
  if (!horoscope.sections || !sectionsLoaded) {
    console.log("No valid sections in horoscope, showing full description");
    return (
      <div className="cosmic-gradient-text text-base font-serif leading-relaxed whitespace-pre-wrap p-4 bg-cosmic-dark/40 border border-cosmic-accent/20 backdrop-blur-sm rounded-lg">
        <h3 className="text-cosmic-accent font-medium mb-3 text-xl">
          {language === 'ru' ? 'Ваш гороскоп на сегодня' : 'Your Horoscope Today'}
        </h3>
        <TypingEffect 
          text={horoscope.description || "Извините, в данный момент гороскоп недоступен. Пожалуйста, попробуйте обновить страницу или повторите запрос позже."} 
          className="cosmic-gradient-text font-serif"
        />
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
    sectionsContent: Object.entries(horoscope.sections || {}).map(([key, value]) => 
      `${key}: ${value ? (value.substring(0, 30) + '...' + `(${value.length} chars)`) : 'missing'}`
    )
  });

  return (
    <div className="space-y-4">
      {sectionConfig.map((section, index) => {
        // Проверяем существование контента для данной секции
        const sectionContent = horoscope.sections?.[section.key];
        
        console.log(`Section ${section.key}:`, {
          content: sectionContent ? (sectionContent.substring(0, 30) + '...') : 'No content',
          length: sectionContent?.length || 0,
          shouldRender: activeSection >= index
        });
        
        // Проверка на null, undefined или пустую строку
        if (!sectionContent || sectionContent.trim() === '') {
          console.log(`Section ${section.key} has no content, using fallback text`);
        }
        
        return (activeSection >= index) && (
          <HoroscopeSection
            key={section.key}
            title={section.title}
            content={sectionContent || `[${language === 'ru' ? 
              'Раздел временно недоступен. Мы работаем над его восстановлением.' : 
              'Section temporarily unavailable. We are working on restoring it.'}]`
            }
            onComplete={activeSection === index ? handleSectionComplete : undefined}
            className="bg-cosmic-dark/40 border-cosmic-accent/20 backdrop-blur-sm"
          />
        );
      })}
      
      {/* Debug section to show raw content when sections validation fails */}
      {(!sectionsLoaded && horoscope.description) && (
        <div className="p-4 mt-6 bg-red-900/20 border border-red-500/40 rounded-md">
          <h3 className="text-red-400 font-bold mb-2">
            {language === 'ru' ? 'Отладка: Проблема с разделами гороскопа' : 'Debug: Issue with horoscope sections'}
          </h3>
          <div className="text-xs overflow-auto max-h-40 p-2 bg-black/30 rounded">
            <p className="text-red-300 mb-2">
              {language === 'ru' ? 
                'Содержимое гороскопа не удалось разделить на секции. Показан полный текст:' : 
                'Failed to divide horoscope into sections. Full text shown:'}
            </p>
            <p className="text-gray-400 whitespace-pre-wrap">{horoscope.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
