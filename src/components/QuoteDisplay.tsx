
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { useToast } from '@/hooks/use-toast';

interface QuoteDisplayProps {
  quote: string;
  className?: string;
}

interface HoroscopeData {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, className }) => {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const { userProfile, language } = useAppStore();
  const { toast } = useToast();
  
  // Format current date based on user language
  useEffect(() => {
    const now = new Date();
    let formattedDate = "";
    
    try {
      switch (language) {
        case 'ru':
          formattedDate = now.toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
          break;
        case 'es':
          formattedDate = now.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
          break;
        default:
          formattedDate = now.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
      }
    } catch (e) {
      // Fallback formatting if localization fails
      formattedDate = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    }
    
    setCurrentDate(formattedDate);
  }, [language]);
  
  // Generate or fetch horoscope
  useEffect(() => {
    const fetchHoroscopeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check for cached horoscope in localStorage
        const storedHoroscope = localStorage.getItem('dailyHoroscope');
        const storedDate = localStorage.getItem('horoscopeDate');
        const today = new Date().toDateString();
        
        if (storedHoroscope && storedDate === today) {
          setHoroscope(JSON.parse(storedHoroscope));
          setLoading(false);
          return;
        }
        
        // Get user zodiac sign if available
        if (!userProfile?.birthDate) {
          throw new Error('Birth date not available');
        }
        
        // Determine zodiac sign based on birth date
        const sign = getZodiacSign(userProfile.birthDate);
        
        if (!sign) {
          throw new Error('Could not determine zodiac sign');
        }
        
        console.log('Fetching horoscope for sign:', sign);
        
        // Fetch horoscope from our edge function
        const { data, error } = await supabase.functions.invoke('fetch-horoscope', {
          body: { 
            sign,
            day: 'today',
            language: language || 'en'
          }
        });
        
        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(`Error fetching horoscope: ${error.message}`);
        }
        
        console.log('Horoscope response:', data);
        
        if (data && data.success && data.data) {
          setHoroscope(data.data);
          // Save to localStorage
          localStorage.setItem('dailyHoroscope', JSON.stringify(data.data));
          localStorage.setItem('horoscopeDate', today);
        } else {
          throw new Error('Invalid response from API');
        }
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        setError(error.message);
        // Show error toast
        toast({
          title: language === 'ru' ? 'Ошибка' : language === 'es' ? 'Error' : 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (userProfile?.birthDate) {
      fetchHoroscopeData();
    }
  }, [language, userProfile?.birthDate, toast]);
  
  const userName = userProfile?.name || 'Искатель';
  const greeting = language === 'ru' ? 'Приветствую тебя' : 
                  language === 'es' ? '¡Te saludo' : 
                  'Greetings';
  
  // Get zodiac sign symbol and name if available
  const zodiacSign = userProfile?.birthDate ? getZodiacSign(userProfile.birthDate) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  return (
    <div className={`text-center p-6 max-w-lg mx-auto ${className}`}>
      <p className="text-cosmic-gold text-lg font-serif mb-2">
        {greeting}, {userName}! {currentDate}
      </p>
      
      {loading ? (
        <p className="italic text-cosmic-accent/70">Загрузка вашего гороскопа...</p>
      ) : error || !horoscope ? (
        <div className="space-y-3">
          {zodiacInfo && (
            <p className="text-lg font-medium">
              {zodiacInfo.symbol} {zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en}
            </p>
          )}
          <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">{quote}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {zodiacInfo && (
            <p className="text-lg font-medium">
              {zodiacInfo.symbol} {zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en} — {horoscope.current_date}
            </p>
          )}
          
          <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">
            ✨ {horoscope.description}
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm mt-3 text-cosmic-accent">
            <p>💫 {language === 'ru' ? 'Настроение' : language === 'es' ? 'Estado de ánimo' : 'Mood'}: {horoscope.mood}</p>
            <p>🎨 {language === 'ru' ? 'Цвет дня' : language === 'es' ? 'Color del día' : 'Color'}: {horoscope.color}</p>
            <p>🎲 {language === 'ru' ? 'Счастливое число' : language === 'es' ? 'Número de la suerte' : 'Lucky number'}: {horoscope.lucky_number}</p>
            <p>🕒 {language === 'ru' ? 'Время удачи' : language === 'es' ? 'Hora de la suerte' : 'Lucky time'}: {horoscope.lucky_time}</p>
          </div>
        </div>
      )}
    </div>
  );
};
