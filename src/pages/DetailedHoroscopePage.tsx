
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DetailedHoroscopeContent } from '@/components/horoscope/DetailedHoroscopeContent';
import { useHoroscopeData } from '@/hooks/useHoroscopeData';
import { getHoroscopeTranslations } from '@/utils/horoscopeUtils';
import { useToast } from '@/hooks/use-toast';

const DetailedHoroscopePage: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shouldFetchHoroscope, setShouldFetchHoroscope] = useState(false);
  
  // Get translations
  const translations = getHoroscopeTranslations(language, userProfile?.name);
  
  // Get zodiac sign info - ensure we're properly converting birthDate string to Date
  const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  const zodiacSign = birthDate ? getZodiacSign(birthDate) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  // Log user profile and zodiac info for debugging
  console.log("DetailedHoroscopePage - User profile:", userProfile);
  console.log("DetailedHoroscopePage - Birth date:", birthDate);
  console.log("DetailedHoroscopePage - Zodiac sign:", zodiacSign);
  console.log("DetailedHoroscopePage - Zodiac info:", zodiacInfo);
  
  // Check if user has a birth date set, but only show toast without auto-redirect
  useEffect(() => {
    if (!userProfile?.birthDate) {
      console.log("No birth date set in profile");
      toast({
        title: language === 'ru' ? 'Требуется дата рождения' : 'Birth Date Required',
        description: language === 'ru' 
          ? 'Чтобы увидеть свой гороскоп, установите дату рождения в профиле.' 
          : 'To view your horoscope, please set your birth date in your profile.',
        variant: 'warning',
      });
    }
  }, [userProfile?.birthDate, language, toast]);
  
  // Handle manually triggering horoscope generation
  const handleGenerateHoroscope = () => {
    console.log("Manually triggering horoscope generation");
    setShouldFetchHoroscope(true);
  };
  
  // Fetch horoscope data only when shouldFetchHoroscope is true
  const { horoscope, loading, zodiacSign: fetchedZodiacSign } = useHoroscopeData({
    userProfile, 
    language, 
    translations,
    isPro: !!userProfile?.isPro,
    shouldFetchHoroscope
  });

  // Additional debug logging
  useEffect(() => {
    console.log("DetailedHoroscopePage - Horoscope loading:", loading);
    console.log("DetailedHoroscopePage - Horoscope data:", horoscope);
    console.log("DetailedHoroscopePage - Is user pro:", !!userProfile?.isPro);
    console.log("DetailedHoroscopePage - Fetched zodiac sign:", fetchedZodiacSign);
    console.log("DetailedHoroscopePage - Should fetch horoscope:", shouldFetchHoroscope);
  }, [horoscope, loading, userProfile?.isPro, fetchedZodiacSign, shouldFetchHoroscope]);

  return (
    <div className="min-h-screen flex flex-col relative pb-16 bg-gradient-to-b from-cosmic-dark to-[#1a0b2e]">
      <StarField starCount={200} />
      <TopBar />
      
      <Button
        variant="ghost"
        className="absolute top-20 left-4 z-20 text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
        onClick={() => navigate('/main')}
      >
        <ArrowLeft size={16} className="mr-2" />
        {translations.backButton[language] || translations.backButton.en}
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 mt-14">
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
