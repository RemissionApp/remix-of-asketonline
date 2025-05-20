
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
  return (
    <>
      <div className="flex items-center mb-3">
        <div className="cosmic-block-icon-wrapper bg-cosmic-dark/60">
          <Flag className="w-5 h-5 text-cosmic-gold" />
        </div>
        <h3 className={language === 'en' ? "font-serif text-lg text-white" : "font-sans text-lg text-white"}>
          {title}
        </h3>
      </div>
      
      <p className={cn(
        "text-sm mb-4 text-shadow",
        language === 'en' ? "font-serif text-cosmic-secondary" : "text-cosmic-secondary"
      )}>
        {description}
      </p>
    </>
  );
};
