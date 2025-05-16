
import React from 'react';
import { TypingEffect } from '@/components/TypingEffect';

interface HoroscopeSectionProps {
  title: string;
  content: string;
  onComplete?: () => void;
}

export const HoroscopeSection: React.FC<HoroscopeSectionProps> = ({
  title,
  content,
  onComplete
}) => {
  return (
    <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
      <h3 className="text-cosmic-accent font-medium mb-1">
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
