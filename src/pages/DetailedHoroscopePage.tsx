
import React, { useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { ArrowLeft } from 'lucide-react';
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
  
  // Get translations
  const translations = getHoroscopeTranslations(language, userProfile?.name);
  
  // Get zodiac sign info - ensure we're properly converting birthDate string to Date
  const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  const zodiacSign = birthDate ? getZodiacSign(birthDate) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  // Log user profile and zodiac info for debugging
  console.log("User profile:", userProfile);
  console.log("Birth date:", birthDate);
  console.log("Zodiac sign:", zodiacSign);
  console.log("Zodiac info:", zodiacInfo);
  
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
      
      // No automatic redirect, allow user to manually navigate if they want
    }
  }, [userProfile?.birthDate, language, toast]);
  
  // Fetch horoscope data
  const { horoscope, loading, zodiacSign: fetchedZodiacSign } = useHoroscopeData({
    userProfile, 
    language, 
    translations,
    isPro: !!userProfile?.isPro
  });

  // Additional debug logging
  useEffect(() => {
    console.log("Horoscope loading:", loading);
    console.log("Horoscope data:", horoscope);
    console.log("Is user pro:", !!userProfile?.isPro);
    console.log("Fetched zodiac sign:", fetchedZodiacSign);
  }, [horoscope, loading, userProfile?.isPro, fetchedZodiacSign]);

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={150} />
      <TopBar />
      
      <Button
        variant="ghost"
        className="absolute top-20 left-4 z-20 text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
        onClick={() => navigate('/main')}
      >
        <ArrowLeft size={16} className="mr-2" />
        {translations.backButton[language] || translations.backButton.en}
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16">
        <div className="w-full max-w-lg">
          <DetailedHoroscopeContent
            horoscope={horoscope}
            loading={loading}
            userProfile={userProfile}
            zodiacInfo={zodiacInfo}
            translations={translations}
            language={language}
          />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default DetailedHoroscopePage;
