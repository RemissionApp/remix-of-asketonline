
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
      console.log("User profile:", JSON.stringify(userProfile));
      console.log("Zodiac info:", JSON.stringify(zodiacInfo));
      setShowGenerateButton(false);
      onGenerateHoroscope();
    }
  }, [userProfile?.isPro, zodiacInfo, onGenerateHoroscope, horoscope, loading]);
  
  console.log("DetailedHoroscopeContent RENDER:", { 
    hasHoroscope: !!horoscope, 
    loading, 
    isPro: !!userProfile?.isPro,
    zodiacInfo: zodiacInfo ? JSON.stringify(zodiacInfo).substring(0, 100) + '...' : null,
    birthDate: userProfile?.birthDate,
    horoscopeData: horoscope ? 'Available' : 'Not available',
    horoscopeSections: horoscope?.sections ? Object.keys(horoscope.sections).join(', ') : 'No sections',
    showGenerateButton
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
    console.log("No zodiac info available, showing message");
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
    console.log("User is not PRO, showing overlay");
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
    console.log("Showing generate button");
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
    console.log("Showing loading state");
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
    console.log("No horoscope data, showing error message");
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
  console.log("Displaying horoscope with sections:", Object.keys(horoscope.sections || {}).join(', '));
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
