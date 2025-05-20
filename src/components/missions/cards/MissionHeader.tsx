
import React from 'react';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface MissionHeaderProps {
  title: string;
  description: string;
  language: 'ru' | 'en' | 'es';
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({ title, description, language }) => {
  const getTitle = () => {
    switch(language) {
      case 'ru': return 'Космическая миссия';
      case 'es': return 'Misión cósmica';
      default: return 'Cosmic mission';
    }
  };

  return (
    <>
      <div className="flex items-center mb-3">
        <div className="cosmic-block-icon-wrapper bg-cosmic-dark/60">
          <Flag className="w-5 h-5 text-cosmic-gold" />
        </div>
        <h3 className={language === 'en' ? "font-serif text-lg text-white" : "font-sans text-lg text-white"}>
          {getTitle()}
        </h3>
      </div>
      
      <h4 className={cn(
        "font-medium mb-1", 
        language === 'en' ? "font-serif text-cosmic-gold" : "text-cosmic-gold"
      )}>
        {title}
      </h4>
      
      <p className={cn(
        "text-sm mb-4 text-shadow",
        language === 'en' ? "font-serif text-cosmic-secondary" : "text-cosmic-secondary"
      )}>
        {description}
      </p>
    </>
  );
};
