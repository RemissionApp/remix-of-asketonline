
import React, { useState, useEffect } from 'react';
import { DetailedHoroscope } from '@/types/horoscope';
import { NoZodiacInfoMessage } from './sections/NoZodiacInfoMessage';
import { HoroscopeProOverlay } from './HoroscopeProOverlay';
import { GenerateButton } from './sections/GenerateButton';
import { LoadingHoroscope } from './sections/LoadingHoroscope';
import { ErrorMessage } from './sections/ErrorMessage';
import { HoroscopeDisplay } from './sections/HoroscopeDisplay';
import { DeveloperSwitch } from '../DeveloperSwitch';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  const [showDevTools, setShowDevTools] = useState(false);
  
  // Add debugging for props
  console.log("DetailedHoroscopeContent PROPS:", {
    horoscopeNull: horoscope === null,
    horoscopeUndefined: horoscope === undefined,
    horoscopeSections: horoscope?.sections ? Object.keys(horoscope.sections).join(', ') : 'No sections',
    loading,
    isPro: !!userProfile?.isPro,
    onGenerateHoroscopeExists: !!onGenerateHoroscope
  });
  
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
      console.log("Calling onGenerateHoroscope function");
      onGenerateHoroscope();
    } else {
      console.log("No onGenerateHoroscope function provided");
    }
  };

  // Handle regenerate horoscope - dedicated function with logging
  const handleRegenerateHoroscope = () => {
    console.log("Regenerating horoscope via developer tools");
    if (onGenerateHoroscope) {
      onGenerateHoroscope();
    } else {
      console.log("ERROR: No onGenerateHoroscope function available for regeneration");
    }
  };

  // Developer tools toggle
  const toggleDevTools = () => {
    setShowDevTools(!showDevTools);
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

  return (
    <>
      {/* Developer tools toggle button */}
      <div className="mb-4 text-right">
        <Button 
          onClick={toggleDevTools}
          variant="ghost"
          size="sm"
          className="text-cosmic-secondary hover:text-cosmic-accent"
        >
          {showDevTools ? 
            (language === 'ru' ? '🔒 Скрыть инструменты' : '🔒 Hide Dev Tools') : 
            (language === 'ru' ? '🛠️ Инструменты разработчика' : '🛠️ Dev Tools')}
        </Button>
      </div>
      
      {/* Developer tools section */}
      {showDevTools && (
        <div className="mb-4 p-3 border border-cosmic-accent/20 bg-cosmic-dark/80 rounded-lg">
          <h3 className="text-cosmic-accent mb-2">Developer Tools</h3>
          <div className="space-y-3">
            <DeveloperSwitch />
            
            <div className="flex justify-end mt-2">
              <Button 
                onClick={handleRegenerateHoroscope} 
                variant="outline"
                size="sm"
                className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
                disabled={loading}
              >
                <RefreshCw size={16} className="mr-1" />
                {language === 'ru' ? 'Сгенерировать новый гороскоп' : 'Generate New Horoscope'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Check if user is PRO */}
      {!userProfile?.isPro ? (
        <HoroscopeProOverlay
          translations={translations}
          language={language}
          zodiacInfo={zodiacInfo}
        />
      ) : loading ? (
        <LoadingHoroscope
          translations={translations}
          language={language}
          zodiacInfo={zodiacInfo}
          userName={userProfile?.name}
        />
      ) : !horoscope && showGenerateButton ? (
        <GenerateButton
          translations={translations}
          language={language}
          zodiacInfo={zodiacInfo}
          userName={userProfile?.name}
          onGenerate={handleGenerateClick}
        />
      ) : !horoscope ? (
        <ErrorMessage
          translations={translations}
          language={language}
          zodiacInfo={zodiacInfo}
          userName={userProfile?.name}
          onRetry={handleGenerateClick}
        />
      ) : (
        <HoroscopeDisplay
          horoscope={horoscope}
          translations={translations}
          language={language}
          zodiacInfo={zodiacInfo}
          userName={userProfile?.name}
          onRegenerate={onGenerateHoroscope}
        />
      )}
    </>
  );
};
