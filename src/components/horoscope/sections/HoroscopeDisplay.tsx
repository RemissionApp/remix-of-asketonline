
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DetailedHoroscope } from '@/types/horoscope';
import { HoroscopeHeader } from './HoroscopeHeader';
import { HoroscopeContent } from './HoroscopeContent';
import { HoroscopeStats } from './HoroscopeStats';

interface HoroscopeDisplayProps {
  horoscope: DetailedHoroscope;
  translations: any;
  language: string;
  zodiacInfo: any;
  userName?: string;
}

export const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({
  horoscope,
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
      <CardContent className="space-y-6">
        <HoroscopeContent 
          horoscope={horoscope}
          translations={translations}
          language={language}
        />
        
        <HoroscopeStats 
          horoscope={horoscope}
          translations={translations}
          language={language}
        />
      </CardContent>
    </Card>
  );
};
