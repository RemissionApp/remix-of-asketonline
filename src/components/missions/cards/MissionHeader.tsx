import React from 'react';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface MissionHeaderProps {
  title: string;
  description: string;
  language: 'ru' | 'en' | 'es';
  hasBackground?: boolean;
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({
  title,
  description,
  language,
  hasBackground = false,
}) => {
  return (
    <>
      <div className="flex items-center mb-3">
        <div className="cosmic-block-icon-wrapper bg-cosmic-dark/60">
          <Flag className="w-5 h-5 text-cosmic-gold" />
        </div>
        <h3
          className={cn(
            language === 'en' ? 'font-serif text-lg' : 'font-sans text-lg',
            hasBackground
              ? 'text-white font-semibold text-shadow'
              : 'text-white'
          )}
        >
          {title}
        </h3>
      </div>

      <p
        className={cn(
          'text-sm mb-4',
          language === 'en' ? 'font-serif' : '',
          hasBackground ? 'text-white text-shadow' : 'text-cosmic-secondary'
        )}
      >
        {description}
      </p>
    </>
  );
};
