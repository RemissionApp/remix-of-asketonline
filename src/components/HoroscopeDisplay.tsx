
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign } from '@/utils/zodiac';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface BriefHoroscope {
  description: string;
}

export const HoroscopeDisplay: React.FC = () => {
  const [horoscope, setHoroscope] = useState<BriefHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Translations for the button text
  const seeMoreText = {
    ru: 'Подробнее',
    en: 'See More',
    es: 'Ver Más',
  }[language] || 'See More';

  // Translations for error messages
  const errorMessages = {
    ru: 'Не удалось загрузить гороскоп',
    en: 'Failed to load horoscope',
    es: 'Error al cargar el horóscopo',
  };

  // Translations for loading text
  const loadingText = {
    ru: 'Соединяемся с космосом...',
    en: 'Connecting with the cosmos...',
    es: 'Conectando con el cosmos...',
  }[language] || 'Connecting with the cosmos...';
  
  // Signature based on language
  const signature = language === 'ru' ? '— Послание Вселенной' : 
                   language === 'es' ? '— Mensaje del Universo' : 
                   '— Message from the Universe';
  
  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        setLoading(true);
        
        // Check if user has birth date to determine zodiac sign
        if (!userProfile?.birthDate) {
          setHoroscope({ description: getDefaultMessage(language) });
          setLoading(false);
          return;
        }
        
        // Get zodiac sign based on birth date
        const sign = getZodiacSign(userProfile.birthDate);
        if (!sign) {
          throw new Error('Could not determine zodiac sign');
        }
        
        // Try to get cached horoscope for today
        const today = new Date().toISOString().split('T')[0];
        const cachedHoroscope = localStorage.getItem(`horoscope_${sign}_${today}_brief`);
        
        if (cachedHoroscope) {
          setHoroscope(JSON.parse(cachedHoroscope));
          setLoading(false);
          return;
        }
        
        // Call our edge function to generate a horoscope
        const { data, error } = await supabase.functions.invoke('generate-horoscope', {
          body: { 
            sign,
            language,
            detailed: false
          }
        });
        
        if (error || !data.success) {
          throw new Error(error?.message || 'Failed to generate horoscope');
        }
        
        // Set the horoscope and cache it
        setHoroscope(data.data);
        localStorage.setItem(`horoscope_${sign}_${today}_brief`, JSON.stringify(data.data));
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        toast({
          title: errorMessages[language] || errorMessages.en,
          description: error.message,
          variant: 'destructive'
        });
        setHoroscope({ description: getDefaultMessage(language) });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoroscope();
  }, [userProfile?.birthDate, language, toast]);

  const handleSeeMore = () => {
    // Check if user is PRO
    if (userProfile?.isPro) {
      // Navigate to detailed horoscope page
      navigate('/detailed-horoscope');
    } else {
      // Navigate to PRO subscription page
      navigate('/comparison');
    }
  };
  
  if (loading) {
    return (
      <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto text-center">
        <p className="text-cosmic-accent italic">{loadingText}</p>
        <Skeleton className="h-20 w-full bg-cosmic-accent/10 rounded-md" />
        <Skeleton className="h-8 w-32 bg-cosmic-accent/10 rounded-md mx-auto" />
      </div>
    );
  }
  
  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto text-center">
      <p className="cosmic-gradient-text text-lg italic font-serif leading-relaxed">
        {horoscope?.description || getDefaultMessage(language)}
      </p>
      <p className="mt-2 text-sm text-cosmic-accent/80">{signature}</p>
      <Button 
        onClick={handleSeeMore}
        variant="outline" 
        className="border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10 mt-3"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {seeMoreText}
      </Button>
    </div>
  );
};

// Helper function for default message
function getDefaultMessage(language: string): string {
  return {
    ru: 'Вселенная ждёт твоего часа рождения, чтобы открыть небесные свитки. Укажи дату рождения — и я прошепчу тебе истину дня.',
    en: 'The universe awaits your birth hour to unlock celestial scrolls. Enter your birth date — and I will whisper the truth of the day.',
    es: 'El universo espera la hora de tu nacimiento para abrir rollos celestiales. Establece tu fecha de nacimiento — y te susurraré la verdad del día.',
  }[language] || 'The universe awaits your birth hour to unlock celestial scrolls. Enter your birth date — and I will whisper the truth of the day.';
}
