
import React from 'react';
import { TypingEffect } from '@/components/TypingEffect';

interface HoroscopeSectionProps {
  title: string;
  content: string;
  onComplete?: () => void;
  className?: string;
}

export const HoroscopeSection: React.FC<HoroscopeSectionProps> = ({
  title,
  content,
  onComplete,
  className = ''
}) => {
  return (
    <div className={`cosmic-section p-4 border border-cosmic-accent/30 rounded-lg shadow-lg ${className} transition-all duration-500 hover:border-cosmic-accent/50`}>
      <h3 className="text-cosmic-accent font-medium mb-2 text-lg">
        {title}
      </h3>
      <TypingEffect 
        text={content}
        className="cosmic-gradient-text font-serif"
        onComplete={onComplete}
      />
    </div>
  );
};
