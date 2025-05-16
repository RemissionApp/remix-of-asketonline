
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign } from '@/utils/zodiac';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';

interface BriefHoroscope {
  description: string;
}

export const HoroscopeDisplay: React.FC = () => {
  const [horoscope, setHoroscope] = useState<BriefHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { userProfile, language, user } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const typingSpeedRef = useRef(30); // milliseconds per character
  
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
  
  // Check if user is PRO
  const isPro = userProfile?.isPro || false;

  // Typing effect
  useEffect(() => {
    if (horoscope && !isTyping) {
      setIsTyping(true);
      setDisplayedText('');
      
      const text = horoscope.description;
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(prev => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeedRef.current);
      
      return () => clearInterval(typingInterval);
    }
  }, [horoscope]);
  
  // Create a helper function to get today's date as a string
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  // Check if the horoscope is from today
  const isHoroscopeFromToday = (storedDate: string) => {
    return storedDate === getTodayDateString();
  };
  
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
        const today = getTodayDateString();
        const cachedHoroscopeKey = `horoscope_${sign}_${today}_brief`;
        const cachedHoroscopeData = localStorage.getItem(cachedHoroscopeKey);
        const cachedHoroscopeDateKey = `horoscope_${sign}_date_brief`;
        const cachedHoroscopeDate = localStorage.getItem(cachedHoroscopeDateKey);
        
        // Use cached horoscope if it exists and is from today
        if (cachedHoroscopeData && cachedHoroscopeDate && isHoroscopeFromToday(cachedHoroscopeDate)) {
          setHoroscope(JSON.parse(cachedHoroscopeData));
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
        
        // Cache the horoscope with today's date
        localStorage.setItem(cachedHoroscopeKey, JSON.stringify(briefHoroscope));
        localStorage.setItem(cachedHoroscopeDateKey, today);
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
    // Navigate to detailed horoscope page
    navigate('/detailed-horoscope');
  };
  
  const horoscopeContent = (
    <div className="w-full max-w-lg mx-auto text-center">
      {loading ? (
        <>
          <p className="text-cosmic-accent italic">{loadingText}</p>
          <Skeleton className="h-20 w-full bg-cosmic-accent/10 rounded-md" />
        </>
      ) : (
        <>
          <p className="cosmic-gradient-text text-lg italic font-serif leading-relaxed min-h-[5rem]">
            {isTyping || displayedText ? displayedText : horoscope?.description || getDefaultMessage(language)}
            {isTyping && <span className="typing-cursor">|</span>}
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
        </>
      )}
    </div>
  );
  
  // For non-PRO users, wrap with ProFeatureOverlay if showing detailed content
  if (!isPro && !loading) {
    return (
      <div className="cosmic-block bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto">
        {horoscopeContent}
      </div>
    );
  }
  
  return (
    <div className="cosmic-block bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto">
      {horoscopeContent}
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
