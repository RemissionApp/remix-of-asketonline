
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ZodiacSignDisplay } from '@/components/ZodiacSignDisplay';

interface GenerateHoroscopeCardProps {
  zodiacSign: string;
  language: string;
  uiText: {
    generateDescription: string;
    generateButton: string;
  };
  onGenerate: () => void;
}

export const GenerateHoroscopeCard: React.FC<GenerateHoroscopeCardProps> = ({
  zodiacSign,
  language,
  uiText,
  onGenerate
}) => {
  return (
    <Card className="p-6 mb-8 bg-slate-800/40 backdrop-blur-sm border-amber-500/30">
      <div className="flex items-center gap-4 mb-4">
        <ZodiacSignDisplay 
          zodiacSign={zodiacSign}
          language={language}
          size="lg"
          showDates={true}
          className="flex items-center"
          symbolClassName="text-4xl"
          textClassName="flex flex-col"
        />
      </div>
      <p className="mb-6">{uiText.generateDescription}</p>
      <Button 
        onClick={onGenerate}
        className="bg-amber-500/80 hover:bg-amber-600/90 text-black backdrop-blur-sm"
      >
        {uiText.generateButton}
      </Button>
    </Card>
  );
};
