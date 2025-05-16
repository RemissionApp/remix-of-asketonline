
import React, { useState, useEffect } from 'react';
import { DetailedHoroscope } from '@/types/horoscope';
import { NoZodiacInfoMessage } from './sections/NoZodiacInfoMessage';
import { HoroscopeProOverlay } from './HoroscopeProOverlay';
import { GenerateButton } from './sections/GenerateButton';
import { LoadingHoroscope } from './sections/LoadingHoroscope';
import { ErrorMessage } from './sections/ErrorMessage';
import { HoroscopeDisplay } from './sections/HoroscopeDisplay';

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
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  
  useEffect(() => {
    // Auto-generate horoscope on component mount if user is PRO and has zodiac sign
    if (userProfile?.isPro && zodiacInfo && onGenerateHoroscope && !horoscope && !loading) {
      console.log("Auto-generating horoscope on page load");
      setShowGenerateButton(false);
      onGenerateHoroscope();
    }
  }, [userProfile?.isPro, zodiacInfo, onGenerateHoroscope, horoscope, loading]);
  
  console.log("DetailedHoroscopeContent rendering with:", { 
    hasHoroscope: !!horoscope, 
    loading, 
    isPro: !!userProfile?.isPro,
    zodiacInfo,
    birthDate: userProfile?.birthDate,
    horoscopeData: horoscope
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
      <NoZodiacInfoMessage 
        translations={translations}
        language={language}
        userName={userProfile?.name}
      />
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
      <GenerateButton
        translations={translations}
        language={language}
        zodiacInfo={zodiacInfo}
        userName={userProfile?.name}
        onGenerate={handleGenerateClick}
      />
    );
  }

  if (loading) {
    return (
      <LoadingHoroscope
        translations={translations}
        language={language}
        zodiacInfo={zodiacInfo}
        userName={userProfile?.name}
      />
    );
  }

  // If horoscope is null, return an error message
  if (!horoscope) {
    return (
      <ErrorMessage
        translations={translations}
        language={language}
        zodiacInfo={zodiacInfo}
        userName={userProfile?.name}
        onRetry={handleGenerateClick}
      />
    );
  }

  // If we have the horoscope data, display it
  return (
    <HoroscopeDisplay
      horoscope={horoscope}
      translations={translations}
      language={language}
      zodiacInfo={zodiacInfo}
      userName={userProfile?.name}
    />
  );
};
