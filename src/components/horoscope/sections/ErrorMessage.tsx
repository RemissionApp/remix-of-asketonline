
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoroscopeHeader } from './HoroscopeHeader';

interface ErrorMessageProps {
  translations: any;
  language: string;
  zodiacInfo: any;
  userName?: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  translations,
  language,
  zodiacInfo,
  userName,
  onRetry
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
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-cosmic-accent text-center">
          {language === 'ru' 
            ? 'Не удалось получить данные гороскопа. Пожалуйста, попробуйте еще раз.'
            : 'Failed to retrieve horoscope data. Please try again.'}
        </p>
        <Button 
          variant="outline" 
          className="mt-4 border-cosmic-accent text-cosmic-accent hover:bg-cosmic-accent/20"
          onClick={onRetry}
        >
          {language === 'ru' ? 'Попробовать снова' : 'Try again'}
        </Button>
      </CardContent>
    </Card>
  );
};
