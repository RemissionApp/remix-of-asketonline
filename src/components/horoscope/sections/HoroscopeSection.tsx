
import React from 'react';
import { TypingEffect } from '@/components/TypingEffect';
import { createLogger } from '@/utils/loggerUtils';

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
  const logger = createLogger('HoroscopeSection');
  
  logger.debug(`Rendering section "${title}"`, { contentLength: content.length });
  
  return (
    <div className={`cosmic-section p-4 border border-cosmic-accent/30 rounded-lg shadow-lg ${className} transition-all duration-500 hover:border-cosmic-accent/50`}>
      <h3 className="text-cosmic-accent font-medium mb-3 text-xl">
        {title}
      </h3>
      <TypingEffect 
        text={content}
        className="cosmic-gradient-text font-serif text-base leading-relaxed"
        onComplete={onComplete}
        speed={30}
      />
    </div>
  );
};
