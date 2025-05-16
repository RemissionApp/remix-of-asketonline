
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DetailedHoroscope } from '@/types/horoscope';
import { HoroscopeHeader } from './sections/HoroscopeHeader';
import { HoroscopeContent } from './sections/HoroscopeContent';
import { HoroscopeStats } from './sections/HoroscopeStats';
import { HoroscopeLoading } from './HoroscopeLoading';
import { HoroscopeProOverlay } from './HoroscopeProOverlay';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';
import { Star } from 'lucide-react';

interface DetailedHoroscopeContentProps {
  horoscope: DetailedHoroscope | null;
  loading: boolean;
  userProfile: any;
  zodiacInfo: any;
  translations: any;
  language: string;
  onGenerateHoroscope?: () => void;
}

export const DetailedHoroscopeContent: React.FC<DetailedHoroscopeContentProps> = ({
  horoscope,
  loading,
  userProfile,
  zodiacInfo,
  translations,
  language,
  onGenerateHoroscope
}) => {
  const navigate = useNavigate();
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  
  console.log("DetailedHoroscopeContent rendering with:", { 
    hasHoroscope: !!horoscope, 
    loading, 
    isPro: !!userProfile?.isPro,
    zodiacInfo,
    birthDate: userProfile?.birthDate
  });

  const handleGenerateClick = () => {
    console.log("Generate horoscope button clicked");
    setShowGenerateButton(false);
    if (onGenerateHoroscope) {
      onGenerateHoroscope();
    }
  };

  // No zodiac info means we probably don't have a birth date
  if (!zodiacInfo) {
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <HoroscopeHeader 
            zodiacInfo={null}
            translations={translations}
            language={language}
            userName={userProfile?.name}
          />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <p className="text-cosmic-accent">
              {language === 'ru' 
                ? 'Пожалуйста, укажите дату рождения в профиле, чтобы увидеть свой гороскоп.'
                : 'Please set your birth date in your profile to see your horoscope.'}
            </p>
            <Button 
              variant="outline" 
              className="border-cosmic-accent text-cosmic-accent hover:bg-cosmic-accent/20"
              onClick={() => navigate('/profile')}
            >
              {language === 'ru' ? 'Перейти в профиль' : 'Go to profile'}
            </Button>
          </div>
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

  // Show the generate button if there's no horoscope and we're not loading
  if (!loading && !horoscope && showGenerateButton) {
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <HoroscopeHeader 
            zodiacInfo={zodiacInfo}
            translations={translations}
            language={language}
            userName={userProfile?.name}
          />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center mb-6 text-cosmic-light">
            {translations.findOutToday?.[language] || translations.findOutToday?.en || 
              (language === 'ru' 
                ? 'Узнайте, что вас ждет сегодня!'
                : 'Find out what awaits you today!')}
          </p>
          <CosmicButton 
            onClick={handleGenerateClick}
            size="lg"
            className="animate-pulse"
          >
            <Star className="mr-2" />
            {translations.generateButton?.[language] || translations.generateButton?.en ||
              (language === 'ru' ? 'Что меня ждет сегодня?' : 'What awaits me today?')}
          </CosmicButton>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <HoroscopeHeader 
            zodiacInfo={zodiacInfo}
            translations={translations}
            language={language}
            userName={userProfile?.name}
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
  }

  // If horoscope is null, return a message
  if (!horoscope) {
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <HoroscopeHeader 
            zodiacInfo={zodiacInfo}
            translations={translations}
            language={language}
            userName={userProfile?.name}
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
            onClick={handleGenerateClick}
          >
            {language === 'ru' ? 'Попробовать снова' : 'Try again'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If we have the horoscope data, display it
  return (
    <Card className="border-cosmic-accent/20 bg-cosmic-dark/50 backdrop-blur-sm shadow-lg">
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
