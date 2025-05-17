
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useFullHoroscope } from '@/hooks/useFullHoroscope';
import { getFullHoroscopeUIText } from '@/utils/fullHoroscopeTranslations';
import { PageHeader } from '@/components/full-horoscope/PageHeader';
import { SetBirthDateCard } from '@/components/full-horoscope/SetBirthDateCard';
import { ErrorCard } from '@/components/full-horoscope/ErrorCard';
import { GenerateHoroscopeCard } from '@/components/full-horoscope/GenerateHoroscopeCard';
import { LoadingState } from '@/components/full-horoscope/LoadingState';
import { HoroscopeContent } from '@/components/full-horoscope/HoroscopeContent';

export default function FullHoroscopePage() {
  const { userProfile, language } = useAppStore();
  const {
    horoscope,
    loading,
    error,
    zodiacSign,
    generateFullHoroscope,
    currentYear
  } = useFullHoroscope();

  // Get UI translations for different languages
  const uiText = getFullHoroscopeUIText(language, currentYear);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader 
          currentYear={currentYear}
          userName={userProfile?.name}
          birthDate={userProfile?.birthDate}
          zodiacSign={zodiacSign}
          language={language}
          uiText={uiText}
        />

        {!zodiacSign && (
          <SetBirthDateCard uiText={uiText} />
        )}

        {error && (
          <ErrorCard 
            error={error} 
            uiText={uiText} 
            onRetry={() => {
              generateFullHoroscope();
            }} 
          />
        )}

        {zodiacSign && !horoscope && !loading && !error && (
          <GenerateHoroscopeCard 
            zodiacSign={zodiacSign} 
            language={language}
            uiText={uiText}
            onGenerate={generateFullHoroscope}
          />
        )}

        {loading && (
          <LoadingState uiText={uiText} />
        )}

        {horoscope && (
          <HoroscopeContent 
            horoscope={horoscope} 
            language={language}
            onRegenerate={generateFullHoroscope}
            uiText={uiText}
          />
        )}
      </div>
    </div>
  );
}
