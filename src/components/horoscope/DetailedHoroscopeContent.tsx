
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DetailedHoroscope } from '@/types/horoscope';
import { HoroscopeHeader } from './sections/HoroscopeHeader';
import { HoroscopeContent } from './sections/HoroscopeContent';
import { HoroscopeStats } from './sections/HoroscopeStats';
import { HoroscopeLoading } from './HoroscopeLoading';
import { HoroscopeProOverlay } from './HoroscopeProOverlay';

interface DetailedHoroscopeContentProps {
  horoscope: DetailedHoroscope | null;
  loading: boolean;
  userProfile: any;
  zodiacInfo: any;
  translations: any;
  language: string;
}

export const DetailedHoroscopeContent: React.FC<DetailedHoroscopeContentProps> = ({
  horoscope,
  loading,
  userProfile,
  zodiacInfo,
  translations,
  language
}) => {
  console.log("DetailedHoroscopeContent rendering with:", { 
    hasHoroscope: !!horoscope, 
    loading, 
    isPro: !!userProfile?.isPro,
    zodiacInfo 
  });

  // No zodiac info means we probably don't have a birth date
  if (!zodiacInfo) {
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <CardHeader>
          <HoroscopeHeader 
            zodiacInfo={null}
            translations={translations}
            language={language}
            userName={userProfile?.name}
          />
        </CardHeader>
        <CardContent>
          <p className="text-cosmic-accent text-center py-8">
            {language === 'ru' 
              ? 'Пожалуйста, укажите дату рождения в профиле, чтобы увидеть свой гороскоп.'
              : 'Please set your birth date in your profile to see your horoscope.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Check if user is PRO
  if (!userProfile?.isPro) {
    return (
      <HoroscopeProOverlay
        translations={translations}
        language={language}
        zodiacInfo={zodiacInfo}
      />
    );
  }

  if (loading || !horoscope) {
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <HoroscopeLoading 
          zodiacInfo={zodiacInfo}
          translations={translations}
          language={language}
        />
      </Card>
    );
  }

  // If we have the horoscope data, display it
  return (
    <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
      <CardHeader>
        <HoroscopeHeader 
          zodiacInfo={zodiacInfo}
          translations={translations}
          language={language}
          userName={userProfile?.name}
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
