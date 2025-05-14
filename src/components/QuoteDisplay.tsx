
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

interface QuoteDisplayProps {
  quote: string;
  className?: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, className }) => {
  const [horoscope, setHoroscope] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const { userProfile, language } = useAppStore();
  
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
    const generateHoroscope = async () => {
      try {
        // Use stored horoscope if we have it for today
        const storedHoroscope = localStorage.getItem('dailyHoroscope');
        const storedDate = localStorage.getItem('horoscopeDate');
        const today = new Date().toDateString();
        
        if (storedHoroscope && storedDate === today) {
          setHoroscope(storedHoroscope);
          return;
        }
        
        // Get user zodiac sign if available
        let prompt = '';
        if (userProfile?.birthDate) {
          // Determine zodiac sign based on birth date
          const birthDate = new Date(userProfile.birthDate);
          const month = birthDate.getMonth() + 1;
          const day = birthDate.getDate();
          
          // Simple zodiac sign determination
          let sign = '';
          if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = 'Овен';
          else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = 'Телец';
          else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = 'Близнецы';
          else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = 'Рак';
          else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = 'Лев';
          else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = 'Дева';
          else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = 'Весы';
          else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = 'Скорпион';
          else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = 'Стрелец';
          else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sign = 'Козерог';
          else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = 'Водолей';
          else sign = 'Рыбы';
          
          prompt = `Короткий личный гороскоп для знака ${sign} на сегодня. Используй загадочный, мистический стиль. Не более 3-4 предложений.`;
        } else {
          // Generic horoscope if no birth date
          prompt = 'Короткий загадочный совет от вселенной на сегодня. Используй мистический стиль. Не более 3-4 предложений.';
        }
        
        // Call universe-answer edge function to generate horoscope
        const { data, error } = await supabase.functions.invoke('universe-answer', {
          body: { 
            question: prompt,
            language: language || 'ru'
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data && data.answer) {
          setHoroscope(data.answer);
          // Save to localStorage
          localStorage.setItem('dailyHoroscope', data.answer);
          localStorage.setItem('horoscopeDate', today);
        }
      } catch (error) {
        console.error('Error generating horoscope:', error);
        // Fallback to default quote
        setHoroscope(quote);
      }
    };
    
    generateHoroscope();
  }, [quote, language, userProfile?.birthDate]);
  
  const userName = userProfile?.name || 'Искатель';
  const greeting = language === 'ru' ? 'Приветствую тебя' : 
                  language === 'es' ? '¡Te saludo' : 
                  'Greetings';
  
  // Signature based on language
  const signature = language === 'ru' ? '— Послание Вселенной' : 
                   language === 'es' ? '— Mensaje del Universo' : 
                   '— Message from the Universe';
  
  return (
    <div className={`text-center p-6 max-w-lg mx-auto ${className}`}>
      <p className="text-cosmic-gold text-lg font-serif mb-2">
        {greeting}, {userName}! {currentDate}
      </p>
      <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">
        {horoscope || quote}
      </p>
      <p className="mt-2 text-sm text-cosmic-accent/80">{signature}</p>
    </div>
  );
};
