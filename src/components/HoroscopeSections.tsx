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

// Function to parse horoscope sections remains the same
export const parseHoroscopeSections = (text: string): { 
  work: string; 
  love: string; 
  health: string; 
  advice: string;
} => {
  // ... keep existing code (parsing function logic)
};
