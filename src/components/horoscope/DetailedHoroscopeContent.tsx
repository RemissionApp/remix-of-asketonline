
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TypingEffect } from '@/components/TypingEffect';
import { DetailedHoroscope } from '@/types/horoscope';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';

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
  const [activeSection, setActiveSection] = useState(0);

  const handleSectionComplete = () => {
    if (activeSection < 3) {
      setTimeout(() => {
        setActiveSection(activeSection + 1);
      }, 500);
    }
  };

  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay
        title={translations.proTitle[language] || translations.proTitle.en}
        message={translations.proMessage[language] || translations.proMessage.en}
      >
        <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-cosmic-gold" size={20} />
              {translations.title[language] || translations.title.en}
            </CardTitle>
            <CardDescription>
              {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </ProFeatureOverlay>
    );
  }

  if (loading || !horoscope) {
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-cosmic-gold" size={20} />
            {translations.title[language] || translations.title.en}
          </CardTitle>
          <CardDescription>
            {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-cosmic-accent/70 italic text-center">
            {translations.loading[language] || translations.loading.en}
          </p>
          <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If we have the horoscope data, display it
  return (
    <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="text-cosmic-gold" size={20} />
          {translations.title[language] || translations.title.en}
        </CardTitle>
        <CardDescription>
          {zodiacInfo?.symbol} {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
        </CardDescription>
        {/* User Greeting */}
        <h2 className="text-cosmic-gold font-serif text-lg mt-2">
          {language === 'ru' 
            ? `Приветствую тебя, ${userProfile.name || 'Искатель'}!` 
            : language === 'es'
              ? `¡Te saludo, ${userProfile.name || 'Buscador'}!`
              : `Greetings, ${userProfile.name || 'Seeker'}!`}
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sectioned horoscope with typing effect */}
        <div className="space-y-4">
          {horoscope.sections ? (
            <>
              <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                <h3 className="text-cosmic-accent font-medium mb-1">
                  {translations.workFinance[language] || translations.workFinance.en}
                </h3>
                <TypingEffect 
                  text={horoscope.sections.work_finance}
                  className="cosmic-gradient-text font-serif"
                  onComplete={activeSection === 0 ? handleSectionComplete : undefined}
                />
              </div>
              
              {activeSection >= 1 && (
                <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                  <h3 className="text-cosmic-accent font-medium mb-1">
                    {translations.loveRelationships[language] || translations.loveRelationships.en}
                  </h3>
                  <TypingEffect 
                    text={horoscope.sections.love_relationships}
                    className="cosmic-gradient-text font-serif"
                    onComplete={activeSection === 1 ? handleSectionComplete : undefined}
                  />
                </div>
              )}
              
              {activeSection >= 2 && (
                <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                  <h3 className="text-cosmic-accent font-medium mb-1">
                    {translations.healthWellbeing[language] || translations.healthWellbeing.en}
                  </h3>
                  <TypingEffect 
                    text={horoscope.sections.health_wellbeing}
                    className="cosmic-gradient-text font-serif"
                    onComplete={activeSection === 2 ? handleSectionComplete : undefined}
                  />
                </div>
              )}
              
              {activeSection >= 3 && (
                <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
                  <h3 className="text-cosmic-accent font-medium mb-1">
                    {translations.dailyAdvice[language] || translations.dailyAdvice.en}
                  </h3>
                  <TypingEffect 
                    text={horoscope.sections.daily_advice}
                    className="cosmic-gradient-text font-serif"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="cosmic-gradient-text text-base font-serif leading-relaxed whitespace-pre-wrap">
              <TypingEffect text={horoscope.description} />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mt-6 text-cosmic-accent">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {translations.luckyNumber[language] || translations.luckyNumber.en}:
            </span>
            <span>{horoscope.lucky_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {translations.luckyTime[language] || translations.luckyTime.en}:
            </span>
            <span>{horoscope.lucky_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {translations.color[language] || translations.color.en}:
            </span>
            <span>{horoscope.color}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {translations.mood[language] || translations.mood.en}:
            </span>
            <span>{horoscope.mood}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
