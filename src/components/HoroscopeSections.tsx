
import React from 'react';
import { useAppStore } from '@/store/useAppStore';

interface HoroscopeSectionProps {
  content: string;
}

export const WorkSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  const { language } = useAppStore();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-500 text-xl">📒</span>
        <h3 className="text-amber-500 font-medium text-xl">
          {language === 'ru' ? 'Работа и финансы' : 
           language === 'es' ? 'Trabajo y Finanzas' : 
           'Work and Finance'}
        </h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

export const LoveSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  const { language } = useAppStore();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-500 text-xl">❤️</span>
        <h3 className="text-amber-500 font-medium text-xl">
          {language === 'ru' ? 'Любовь и отношения' : 
           language === 'es' ? 'Amor y Relaciones' : 
           'Love and Relationships'}
        </h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

export const HealthSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  const { language } = useAppStore();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-500 text-xl">🧘</span>
        <h3 className="text-amber-500 font-medium text-xl">
          {language === 'ru' ? 'Здоровье и самочувствие' : 
           language === 'es' ? 'Salud y Bienestar' : 
           'Health and Well-being'}
        </h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

export const AdviceSection: React.FC<HoroscopeSectionProps> = ({ content }) => {
  const { language } = useAppStore();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-500 text-xl">✨</span>
        <h3 className="text-amber-500 font-medium text-xl">
          {language === 'ru' ? 'Совет дня' : 
           language === 'es' ? 'Consejo del Día' : 
           'Advice of the Day'}
        </h3>
      </div>
      <p className="text-cosmic-secondary">{content}</p>
    </div>
  );
};

// Function to parse horoscope sections
export const parseHoroscopeSections = (text: string): { 
  work: string; 
  love: string; 
  health: string; 
  advice: string;
} => {
  const defaultSections = {
    work: '',
    love: '',
    health: '',
    advice: ''
  };
  
  if (!text) {
    return defaultSections;
  }
  
  // Split the text by double newlines to separate sections
  const sections = text.split(/\n\s*\n/);
  
  let workSection = '';
  let loveSection = '';
  let healthSection = '';
  let adviceSection = '';
  
  // Find each section based on emojis or keywords
  sections.forEach(section => {
    const lowerSection = section.toLowerCase();
    
    if (
      lowerSection.includes('work') || 
      lowerSection.includes('finance') || 
      lowerSection.includes('работа') || 
      lowerSection.includes('финанс') ||
      lowerSection.includes('trabajo') ||
      lowerSection.includes('finanzas') ||
      section.includes('📒') ||
      section.includes('💼')
    ) {
      workSection = section;
    } 
    else if (
      lowerSection.includes('love') || 
      lowerSection.includes('relationship') || 
      lowerSection.includes('любовь') || 
      lowerSection.includes('отношения') ||
      lowerSection.includes('amor') ||
      lowerSection.includes('relaciones') ||
      section.includes('❤️')
    ) {
      loveSection = section;
    }
    else if (
      lowerSection.includes('health') || 
      lowerSection.includes('well') || 
      lowerSection.includes('здоровье') || 
      lowerSection.includes('самочувств') ||
      lowerSection.includes('salud') ||
      lowerSection.includes('bienestar') ||
      section.includes('🧘')
    ) {
      healthSection = section;
    }
    else if (
      lowerSection.includes('advice') || 
      lowerSection.includes('tip') || 
      lowerSection.includes('совет') ||
      lowerSection.includes('consejo') ||
      section.includes('✨')
    ) {
      adviceSection = section;
    }
  });
  
  // Remove headers from content
  const cleanContent = (content: string) => {
    return content
      .replace(/^.*?[—\-:]/, '')  // Remove header up to first colon or dash
      .replace(/^[📒💼❤️🧘✨].*?[\n]/, '')  // Remove emoji header line
      .trim();
  };
  
  return {
    work: workSection ? cleanContent(workSection) : defaultSections.work,
    love: loveSection ? cleanContent(loveSection) : defaultSections.love,
    health: healthSection ? cleanContent(healthSection) : defaultSections.health,
    advice: adviceSection ? cleanContent(adviceSection) : defaultSections.advice
  };
};
