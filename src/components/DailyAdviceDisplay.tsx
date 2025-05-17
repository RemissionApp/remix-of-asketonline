
import React, { useEffect, useState } from 'react';
import { Calendar, LightbulbIcon, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/utils/dateFormatUtils';

export const DailyAdviceDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const [dailyAdvice, setDailyAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDailyAdvice = async () => {
      setIsLoading(true);
      try {
        // Check if we have cached advice for today
        const today = new Date().toISOString().split('T')[0];
        const cachedAdviceKey = `daily_advice_${today}_${language}`;
        const cachedAdvice = localStorage.getItem(cachedAdviceKey);
        
        if (cachedAdvice) {
          setDailyAdvice(cachedAdvice);
          setIsLoading(false);
          return;
        }

        // Generate new advice using edge function
        const name = userProfile?.name || 'Искатель';
        let prompt = '';
        
        if (language === 'ru') {
          prompt = `сгенерируй гороскоп пользователя на день из 3 предложений`;
        } else if (language === 'es') {
          prompt = `genera un horóscopo de usuario para el día en 3 oraciones`;
        } else {
          prompt = `generate a user's horoscope for today in 3 sentences`;
        }

        // Call universe-answer function to generate advice
        const { data, error } = await supabase.functions.invoke('universe-answer', {
          body: { question: prompt, language }
        });

        if (error) {
          console.error("Error generating daily advice:", error);
          throw new Error(error.message);
        }

        let generatedAdvice = '';
        if (data && typeof data === 'object' && 'answer' in data) {
          generatedAdvice = data.answer;
        } else if (typeof data === 'string') {
          generatedAdvice = data;
        } else {
          throw new Error('Invalid response format from universe-answer function');
        }

        // Save to local storage
        localStorage.setItem(cachedAdviceKey, generatedAdvice);
        setDailyAdvice(generatedAdvice);
      } catch (error) {
        console.error("Error:", error);
        // Fallback advice
        const fallbackAdvice = language === 'ru' 
          ? 'Сегодня хороший день, чтобы сделать шаг к своей цели. Даже маленький прогресс — это всё равно прогресс.' 
          : language === 'es'
            ? 'Hoy es un buen día para dar un paso hacia tu meta. Incluso un pequeño progreso sigue siendo progreso.'
            : 'Today is a good day to take a step towards your goal. Even small progress is still progress.';
        setDailyAdvice(fallbackAdvice);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyAdvice();
  }, [language, userProfile?.name]);

  // Format the current date based on language
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    return currentDateTime.toLocaleDateString(
      language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US', 
      options
    );
  };

  // Определяем имя для приветствия
  const userName = userProfile?.name || (language === 'ru' ? 'Искатель' : language === 'es' ? 'Buscador' : 'Seeker');

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Приветствие пользователя */}
      <div className="mb-6 text-center p-4 relative z-10">
        <h2 className={language === 'en' ? "font-serif text-2xl font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" : "font-sans text-2xl font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"}>
          {language === 'ru' 
            ? "Приветствую тебя!" 
            : language === 'es'
              ? "¡Te saludo!"
              : "Greetings!"}
        </h2>
        <h3 className={language === 'en' ? "font-serif text-2xl mt-2 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" : "font-sans text-2xl mt-2 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"}>
          {userName}
        </h3>
        <div className="flex items-center justify-center mt-3 text-slate-300 text-sm font-medium">
          <Clock size={14} className="mr-1" />
          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{getFormattedDate()}</span>
        </div>
      </div>
      
      <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
              <LightbulbIcon size={20} className="text-cosmic-gold animate-pulse-slow" />
            </div>
            <h3 className={language === 'en' ? "font-serif font-medium" : "font-sans font-medium"}>
              {language === 'ru' ? 'Совет дня' : language === 'es' ? 'Consejo del día' : 'Daily Advice'}
            </h3>
          </div>

          {isLoading ? (
            <Skeleton className="h-14 w-full bg-cosmic-accent/10 rounded-md" />
          ) : (
            <div className="px-1 py-2">
              <p className="text-white text-base font-sans leading-relaxed text-center">
                {dailyAdvice}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
