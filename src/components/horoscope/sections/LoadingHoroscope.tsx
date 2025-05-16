
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { HoroscopeHeader } from './HoroscopeHeader';
import { HoroscopeLoading } from '../HoroscopeLoading';

interface LoadingHoroscopeProps {
  translations: any;
  language: string;
  zodiacInfo: any;
  userName?: string;
}

export const LoadingHoroscope: React.FC<LoadingHoroscopeProps> = ({
  translations,
  language,
  zodiacInfo,
  userName
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
      <CardContent className="flex flex-col items-center justify-center">
        <p className="text-center mb-6 text-cosmic-accent text-xl">
          {translations.universeThinking?.[language] || translations.universeThinking?.en ||
            (language === 'ru' 
              ? 'Вселенная думает...'
              : 'The universe is thinking...')}
        </p>
        <HoroscopeLoading 
          zodiacInfo={zodiacInfo}
          translations={translations}
          language={language}
        />
      </CardContent>
    </Card>
  );
};
