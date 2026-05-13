import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { DetailedHoroscopeContent } from '@/components/horoscope/DetailedHoroscopeContent';
import { useHoroscopeData } from '@/hooks/useHoroscopeData';
import { getHoroscopeTranslations } from '@/utils/horoscopeUtils';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/ui/PageHeader';

const DetailedHoroscopePage: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { toast } = useToast();
  const [shouldFetchHoroscope, setShouldFetchHoroscope] = useState(false);

  // Get translations
  const translations = getHoroscopeTranslations(language, userProfile?.name);

  // Get zodiac sign info - ensure we're properly converting birthDate string to Date
  const birthDate = userProfile?.birthDate
    ? new Date(userProfile.birthDate)
    : null;
  const zodiacSign = birthDate ? getZodiacSign(birthDate) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;

  console.log('DetailedHoroscopePage INIT:', {
    userProfile: userProfile
      ? JSON.stringify({
          name: userProfile.name,
          birthDate: userProfile.birthDate,
          isPro: userProfile.isPro,
        })
      : null,
    birthDate: birthDate?.toISOString(),
    zodiacSign,
    zodiacInfo: zodiacInfo ? zodiacInfo.name.en : null,
    language,
    shouldFetchHoroscope,
  });

  // Check if user has a birth date set, but only show toast without auto-redirect
  useEffect(() => {
    if (!userProfile?.birthDate) {
      console.log('No birth date set in profile');
      toast({
        title:
          language === 'ru' ? 'Требуется дата рождения' : 'Birth Date Required',
        description:
          language === 'ru'
            ? 'Чтобы увидеть свой гороскоп, установите дату рождения в профиле.'
            : 'To view your horoscope, please set your birth date in your profile.',
        variant: 'warning',
      });
    } else {
      console.log('Birth date is set:', userProfile.birthDate);

        // Auto-generate on mount when birth date exists
        if (zodiacSign) {
        console.log('Auto-triggering horoscope generation for PRO user');
        setShouldFetchHoroscope(true);
      }
    }
    }, [userProfile?.birthDate, language, toast, zodiacSign]);

  // Handle manually triggering horoscope generation with improved logging
  const handleGenerateHoroscope = () => {
    console.log('Manually triggering horoscope generation');
    console.log('Current shouldFetchHoroscope state:', shouldFetchHoroscope);
    setShouldFetchHoroscope(prevState => {
      console.log('Setting shouldFetchHoroscope from', prevState, 'to true');
      return true;
    });
    // Force refresh by setting to false then back to true in the next tick
    if (shouldFetchHoroscope) {
      console.log('shouldFetchHoroscope is already true, forcing refresh');
      setShouldFetchHoroscope(false);
      setTimeout(() => {
        console.log('Setting shouldFetchHoroscope back to true after timeout');
        setShouldFetchHoroscope(true);
      }, 100);
    }
  };

  // Fetch horoscope data only when shouldFetchHoroscope is true
  const {
    horoscope,
    loading,
    zodiacSign: fetchedZodiacSign,
  } = useHoroscopeData({
    userProfile,
    language,
    translations,
    isPro: true,
    shouldFetchHoroscope,
  });

  // Additional debug logging
  useEffect(() => {
    console.log('DetailedHoroscopePage STATE UPDATE:', {
      horoscope: horoscope
        ? {
            hasSections: !!horoscope.sections,
            sectionKeys: horoscope.sections
              ? Object.keys(horoscope.sections).join(', ')
              : 'No sections',
          }
        : null,
      loading,
      isPro: !!userProfile?.isPro,
      fetchedZodiacSign,
      shouldFetchHoroscope,
    });
  }, [
    horoscope,
    loading,
    userProfile?.isPro,
    fetchedZodiacSign,
    shouldFetchHoroscope,
  ]);

  return (
    <div className="min-h-screen flex flex-col relative pb-16 bg-gradient-to-b from-cosmic-dark to-[#1a0b2e]">
      <StarField starCount={200} />

      <PageHeader
        title={
          language === 'ru'
            ? 'Подробный гороскоп'
            : language === 'es'
              ? 'Horóscopo detallado'
              : 'Detailed Horoscope'
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 pt-page">
        <div className="w-full max-w-lg">
          <DetailedHoroscopeContent
            horoscope={horoscope}
            loading={loading}
            userProfile={userProfile}
            zodiacInfo={zodiacInfo}
            translations={translations}
            language={language}
            onGenerateHoroscope={handleGenerateHoroscope}
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DetailedHoroscopePage;
