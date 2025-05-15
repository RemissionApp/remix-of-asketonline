
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
  const { userProfile, language, user } = useAppStore();
  const navigate = useNavigate();
  
  // Translations for the button text
  const seeMoreText = {
    ru: 'Подробнее',
    en: 'See More',
    es: 'Ver Más',
  }[language] || 'See More';
  
  // Signature based on language
  const signature = language === 'ru' ? '— Послание Вселенной' : 
                   language === 'es' ? '— Mensaje del Universo' : 
                   '— Message from the Universe';

  // Translations for loading text
  const loadingText = {
    ru: 'Соединяемся с космосом...',
    en: 'Connecting with the cosmos...',
    es: 'Conectando con el cosmos...',
  }[language] || 'Connecting with the cosmos...';
  
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
        const { data, error } = await supabase.functions.invoke('fetch-horoscope', {
          body: { 
            sign,
            language,
            detailed: false
          }
        });
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch horoscope');
        }
        
        if (!data.success) {
          throw new Error('Invalid response from fetch-horoscope function');
        }
        
        // Set the horoscope with just the description
        const briefHoroscope = { description: data.data.description };
        setHoroscope(briefHoroscope);
        localStorage.setItem(`horoscope_${sign}_${today}_brief`, JSON.stringify(briefHoroscope));
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        setHoroscope({ description: getDefaultMessage(language) });
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch horoscope when user is logged in and we have their profile
    if (user && userProfile) {
      fetchHoroscope();
    } else {
      // If not logged in, show default message
      setHoroscope({ description: getDefaultMessage(language) });
      setLoading(false);
    }
  }, [userProfile?.birthDate, language, user, userProfile]);

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
      <div className="bg-background border border-border rounded-lg p-6 mb-6 w-full max-w-lg mx-auto text-center">
        <p className="text-muted-foreground text-sm">{loadingText}</p>
        <Skeleton className="h-20 w-full bg-muted/50 rounded-md mt-3" />
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-input rounded-lg p-6 mb-6 w-full max-w-lg mx-auto">
      <blockquote className="border-l-2 border-muted pl-4 italic text-foreground">
        <p className="leading-relaxed">
          {horoscope?.description || getDefaultMessage(language)}
        </p>
        <footer className="mt-2 text-sm text-muted-foreground text-right">
          {signature}
        </footer>
      </blockquote>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={handleSeeMore}
          variant="outline" 
          size="sm"
          className="text-sm"
        >
          {seeMoreText}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
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
