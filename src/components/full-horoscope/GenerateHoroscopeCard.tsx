
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { zodiacData } from '@/utils/zodiac';

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
    <Card className="p-6 mb-8 bg-slate-800 border-amber-500/30">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{zodiacData[zodiacSign].symbol}</span>
        <div>
          <h2 className="text-xl font-semibold text-amber-300">
            {language === 'ru' ? zodiacData[zodiacSign].name.ru :
             language === 'es' ? zodiacData[zodiacSign].name.es :
             zodiacData[zodiacSign].name.en}
          </h2>
          <p className="text-gray-400">{zodiacData[zodiacSign].dates}</p>
        </div>
      </div>
      <p className="mb-6">{uiText.generateDescription}</p>
      <Button 
        onClick={onGenerate}
        className="bg-amber-500 hover:bg-amber-600 text-black"
      >
        {uiText.generateButton}
      </Button>
    </Card>
  );
};
