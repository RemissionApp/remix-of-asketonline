
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';

interface DetailedHoroscope {
  description: string;
  lucky_number: string;
  lucky_time: string;
  color: string;
  mood: string;
}

const DetailedHoroscopePage: React.FC = () => {
  const [horoscope, setHoroscope] = useState<DetailedHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile, language } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get zodiac sign info
  const zodiacSign = userProfile?.birthDate ? getZodiacSign(userProfile.birthDate) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  // Translations
  const translations = {
    title: {
      ru: 'Подробный гороскоп',
      en: 'Detailed Horoscope',
      es: 'Horóscopo Detallado'
    },
    backButton: {
      ru: 'Назад',
      en: 'Back',
      es: 'Atrás'
    },
    loading: {
      ru: 'Раскрываем тайны звезд...',
      en: 'Revealing the mysteries of the stars...',
      es: 'Revelando los misterios de las estrellas...'
    },
    luckyNumber: {
      ru: 'Счастливое число',
      en: 'Lucky Number',
      es: 'Número de la Suerte'
    },
    luckyTime: {
      ru: 'Удачное время',
      en: 'Lucky Time',
      es: 'Hora de la Suerte'
    },
    color: {
      ru: 'Цвет дня',
      en: 'Color of the Day',
      es: 'Color del Día'
    },
    mood: {
      ru: 'Настроение',
      en: 'Mood',
      es: 'Estado de Ánimo'
    },
    proTitle: {
      ru: 'Подробный гороскоп',
      en: 'Detailed Horoscope',
      es: 'Horóscopo Detallado'
    },
    proMessage: {
      ru: 'Узнайте, что звезды приготовили для вас сегодня в полной версии',
      en: 'Discover what the stars have prepared for you today in the full version',
      es: 'Descubre lo que las estrellas han preparado para ti hoy en la versión completa'
    }
  };

  useEffect(() => {
    const fetchDetailedHoroscope = async () => {
      if (!userProfile?.isPro) {
        // For non-PRO users, just set loading to false without fetching
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Check if user has birth date to determine zodiac sign
        if (!userProfile?.birthDate || !zodiacSign) {
          setLoading(false);
          return;
        }
        
        // Try to get cached detailed horoscope for today
        const today = new Date().toISOString().split('T')[0];
        const cachedHoroscope = localStorage.getItem(`horoscope_${zodiacSign}_${today}_detailed`);
        
        if (cachedHoroscope) {
          setHoroscope(JSON.parse(cachedHoroscope));
          setLoading(false);
          return;
        }
        
        // Call our edge function to generate a detailed horoscope
        const { data, error } = await supabase.functions.invoke('generate-horoscope', {
          body: { 
            sign: zodiacSign,
            language,
            detailed: true
          }
        });
        
        if (error || !data.success) {
          throw new Error(error?.message || 'Failed to generate detailed horoscope');
        }
        
        // Set the horoscope and cache it
        setHoroscope(data.data);
        localStorage.setItem(`horoscope_${zodiacSign}_${today}_detailed`, JSON.stringify(data.data));
      } catch (error) {
        console.error('Error fetching detailed horoscope:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailedHoroscope();
  }, [userProfile?.birthDate, userProfile?.isPro, zodiacSign, language, toast]);
  
  const renderDetailedHoroscope = () => {
    if (!userProfile?.isPro) {
      return (
        <ProFeatureOverlay
          title={translations.proTitle[language] || translations.proTitle.en}
          message={translations.proMessage[language] || translations.proMessage.en}
        >
          <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-cosmic-gold" size={20} />
                {translations.title[language] || translations.title.en}
              </CardTitle>
              <CardDescription>
                {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </ProFeatureOverlay>
      );
    }
    
    if (loading || !horoscope) {
      return (
        <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-cosmic-gold" size={20} />
              {translations.title[language] || translations.title.en}
            </CardTitle>
            <CardDescription>
              {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cosmic-accent/70 italic text-center">
              {translations.loading[language] || translations.loading.en}
            </p>
            <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-cosmic-gold" size={20} />
            {translations.title[language] || translations.title.en}
          </CardTitle>
          <CardDescription>
            {zodiacInfo?.symbol} {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="cosmic-gradient-text text-base font-serif leading-relaxed whitespace-pre-wrap">
            {horoscope.description}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mt-6 text-cosmic-accent">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.luckyNumber[language] || translations.luckyNumber.en}:
              </span>
              <span>{horoscope.lucky_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.luckyTime[language] || translations.luckyTime.en}:
              </span>
              <span>{horoscope.lucky_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.color[language] || translations.color.en}:
              </span>
              <span>{horoscope.color}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.mood[language] || translations.mood.en}:
              </span>
              <span>{horoscope.mood}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
          {renderDetailedHoroscope()}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default DetailedHoroscopePage;
