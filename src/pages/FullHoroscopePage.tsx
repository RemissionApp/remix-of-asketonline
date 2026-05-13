import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useFullHoroscope } from '@/hooks/useFullHoroscope';
import { useDailyHoroscope } from '@/hooks/useDailyHoroscope';
import { useMonthlyHoroscope } from '@/hooks/useMonthlyHoroscope';
import { getFullHoroscopeUIText } from '@/utils/fullHoroscopeTranslations';
import { PageHeader as FullPageHeader } from '@/components/full-horoscope/PageHeader';
import { SetBirthDateCard } from '@/components/full-horoscope/SetBirthDateCard';
import { ErrorCard } from '@/components/full-horoscope/ErrorCard';
import { UserZodiacInfo } from '@/components/full-horoscope/UserZodiacInfo';
import { DailyHoroscopeCard } from '@/components/full-horoscope/DailyHoroscopeCard';
import { MonthlyHoroscopeCard } from '@/components/full-horoscope/MonthlyHoroscopeCard';
import { YearlyHoroscopeCard } from '@/components/full-horoscope/YearlyHoroscopeCard';
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
      className="min-h-screen text-white relative pb-page"
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
            ? 'Гороскоп'
            : language === 'es'
              ? 'Horóscopo'
              : 'Horoscope'
        }
      />

      <div className="max-w-lg mx-auto relative z-10 pt-page px-3 sm:px-4 pb-page flex flex-col gap-3 sm:gap-4">
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
            {/* User Zodiac Info */}
            <UserZodiacInfo
              zodiacSign={zodiacSign}
              birthDate={typeof userProfile?.birthDate === 'string' ? userProfile.birthDate : userProfile?.birthDate?.toISOString().split('T')[0] || ''}
              userName={userProfile?.name || null}
              language={language}
              uiText={uiText}
            />

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
            <YearlyHoroscopeCard
              zodiacSign={zodiacSign}
              horoscope={horoscope}
              loading={loading}
              error={error}
              onGenerate={generateFullHoroscope}
              language={language}
              currentYear={currentYear}
              uiText={uiText}
            />
          </>
        )}
      </div>

      {/* Add bottom navigation */}
      <BottomNavigation />
    </div>
  );
}
