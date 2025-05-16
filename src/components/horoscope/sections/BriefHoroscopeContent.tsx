
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { getDefaultMessage } from '@/utils/horoscopeUtils';

interface BriefHoroscopeContentProps {
  displayedText: string;
  isTyping: boolean;
  horoscopeDescription?: string;
  signature: string;
  language: string;
  seeMoreText: string;
  onSeeMore: () => void;
}

export const BriefHoroscopeContent: React.FC<BriefHoroscopeContentProps> = ({
  displayedText,
  isTyping,
  horoscopeDescription,
  signature,
  language,
  seeMoreText,
  onSeeMore
}) => {
  return (
    <>
      <p className="cosmic-gradient-text text-lg italic font-serif leading-relaxed min-h-[5rem]">
        {isTyping || displayedText 
          ? displayedText 
          : horoscopeDescription || getDefaultMessage(language)}
        {isTyping && <span className="typing-cursor">|</span>}
      </p>
      <p className="mt-2 text-sm text-cosmic-accent/80">{signature}</p>
      <Button 
        onClick={onSeeMore}
        variant="outline" 
        className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10 mt-3"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {seeMoreText}
      </Button>
    </>
  );
};
