import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { HoroscopeHeader } from './HoroscopeHeader';
import { CosmicButton } from '@/components/CosmicButton';
import { Star } from 'lucide-react';

interface GenerateButtonProps {
  translations: any;
  language: string;
  zodiacInfo: any;
  userName?: string;
  onGenerate: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  translations,
  language,
  zodiacInfo,
  userName,
  onGenerate,
}) => {
  return (
    <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <HoroscopeHeader
          zodiacInfo={zodiacInfo}
          translations={translations}
          language={language}
          userName={userName}
        />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <p className="text-center mb-6 text-cosmic-light">
          {translations.findOutToday?.[language] ||
            translations.findOutToday?.en ||
            (language === 'ru'
              ? 'Узнайте, что вас ждет сегодня!'
              : 'Find out what awaits you today!')}
        </p>
        <CosmicButton onClick={onGenerate} size="lg" className="animate-pulse">
          <Star className="mr-2" />
          {translations.generateButton?.[language] ||
            translations.generateButton?.en ||
            (language === 'ru'
              ? 'Что меня ждет сегодня?'
              : 'What awaits me today?')}
        </CosmicButton>
      </CardContent>
    </Card>
  );
};
