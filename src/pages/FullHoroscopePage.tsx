import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useFullHoroscope } from '@/hooks/useFullHoroscope';
import { useDailyHoroscope } from '@/hooks/useDailyHoroscope';
import { useMonthlyHoroscope } from '@/hooks/useMonthlyHoroscope';
import { getFullHoroscopeUIText } from '@/utils/fullHoroscopeTranslations';
import { PageHeader as FullPageHeader } from '@/components/full-horoscope/PageHeader';
import { SetBirthDateCard } from '@/components/full-horoscope/SetBirthDateCard';
import { ErrorCard } from '@/components/full-horoscope/ErrorCard';
import { GenerateHoroscopeCard } from '@/components/full-horoscope/GenerateHoroscopeCard';
import { LoadingState } from '@/components/full-horoscope/LoadingState';
import { HoroscopeContent } from '@/components/full-horoscope/HoroscopeContent';
import { DailyHoroscopeCard } from '@/components/full-horoscope/DailyHoroscopeCard';
import { MonthlyHoroscopeCard } from '@/components/full-horoscope/MonthlyHoroscopeCard';
import { MovingStarField } from '@/components/full-horoscope/MovingStarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { PageHeader } from '@/components/PageHeader';

export default function FullHoroscopePage() {
  const { userProfile, language } = useAppStore();
  const {
    horoscope,
    loading,
    error,
    zodiacSign,
    generateFullHoroscope,
    currentYear,
  } = useFullHoroscope();

  const {
    horoscope: dailyHoroscope,
    loading: dailyLoading,
    generateDailyHoroscope,
  } = useDailyHoroscope();

  const {
    horoscope: monthlyHoroscope,
    loading: monthlyLoading,
    generateMonthlyHoroscope,
  } = useMonthlyHoroscope();

  // Get UI translations for different languages
  const uiText = getFullHoroscopeUIText(language, currentYear);

  return (
    <div
      className="min-h-screen text-white relative pb-20"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.3)), url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Horoscope.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Add the moving star field overlay */}
      <MovingStarField />

      <PageHeader
        title={
          language === 'ru'
            ? 'Полный гороскоп'
            : language === 'es'
              ? 'Horóscopo completo'
              : 'Full Horoscope'
        }
      />

      <div className="max-w-4xl mx-auto relative z-10 pt-20 p-4 md:p-8 space-y-6">
        {!zodiacSign && <SetBirthDateCard uiText={uiText} />}

        {error && (
          <ErrorCard
            error={error}
            uiText={uiText}
            onRetry={() => {
              generateFullHoroscope();
            }}
          />
        )}

        {zodiacSign && (
          <>
            {/* Daily Horoscope */}
            <DailyHoroscopeCard
              zodiacSign={zodiacSign}
              horoscope={dailyHoroscope}
              loading={dailyLoading}
              onGenerate={() => generateDailyHoroscope(zodiacSign)}
              uiText={uiText}
            />

            {/* Monthly Horoscope */}
            <MonthlyHoroscopeCard
              zodiacSign={zodiacSign}
              horoscope={monthlyHoroscope}
              loading={monthlyLoading}
              onGenerate={() => generateMonthlyHoroscope(zodiacSign)}
              uiText={uiText}
            />

            {/* Yearly Horoscope */}
            {!horoscope && !loading && !error && (
              <GenerateHoroscopeCard
                zodiacSign={zodiacSign}
                language={language}
                uiText={uiText}
                onGenerate={generateFullHoroscope}
              />
            )}

            {loading && <LoadingState uiText={uiText} />}

            {horoscope && (
              <HoroscopeContent
                horoscope={horoscope}
                language={language}
                onRegenerate={generateFullHoroscope}
                uiText={uiText}
              />
            )}
          </>
        )}
      </div>

      {/* Add bottom navigation */}
      <BottomNavigation />
    </div>
  );
}
