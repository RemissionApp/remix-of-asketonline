
import React, { useEffect, useState } from 'react';
import { Calendar, LightbulbIcon, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/utils/dateFormatUtils';
import { TypingEffect } from './TypingEffect';
import { getDateString } from '@/store/utils/dateUtils';

export const DailyAdviceDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const [dailyAdvice, setDailyAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
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
        const today = getDateString(new Date());
        const cachedAdviceKey = `daily_advice_${today}_${language}`;
        const cachedAdvice = localStorage.getItem(cachedAdviceKey);
        
        if (cachedAdvice) {
          console.log('Using cached daily advice');
          setDailyAdvice(cachedAdvice);
          setIsLoading(false);
          return;
        }

        // Generate new advice using edge function
        const name = userProfile?.name || 'Искатель';
        let prompt = '';
        
        if (language === 'ru') {
          prompt = `Дай короткий персональный прогноз дня для ${name} в стиле гороскопа. Совет должен быть конкретным, практичным (2-3 предложения), содержать указание на возможные события дня и полезную рекомендацию. Не упоминай имя в ответе. Не используй общие фразы вроде "помни" или "не забывай". Пиши как будто ты точно знаешь, что произойдет сегодня.`;
        } else if (language === 'es') {
          prompt = `Da un pronóstico personal breve para el día de hoy para ${name} en estilo de horóscopo. El consejo debe ser concreto, práctico (2-3 oraciones), contener una indicación de posibles eventos del día y una recomendación útil. No menciones el nombre en la respuesta. No uses frases generales como "recuerda" o "no olvides". Escribe como si supieras exactamente qué sucederá hoy.`;
        } else {
          prompt = `Give a short personal forecast for ${name}'s day in horoscope style. The advice should be specific, practical (2-3 sentences), contain an indication of possible events of the day and a useful recommendation. Don't mention the name in the response. Don't use general phrases like "remember" or "don't forget". Write as if you know exactly what will happen today.`;
        }

        // Call universe-answer function to generate advice
        const { data, error } = await supabase.functions.invoke('universe-answer', {
          body: { prompt, language }
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
          ? 'Сегодня день благоприятен для новых начинаний. Вечером возможна неожиданная встреча, которая изменит ваши планы. Обратите внимание на детали — в них кроется решение.' 
          : language === 'es'
            ? 'Hoy es un día favorable para nuevos comienzos. Por la tarde puede haber un encuentro inesperado que cambiará tus planes. Presta atención a los detalles, en ellos se esconde la solución.'
            : 'Today is favorable for new beginnings. In the evening, an unexpected encounter may change your plans. Pay attention to details — the solution lies within them.';
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

  // Get the signature based on language
  const getSignature = () => {
    return language === 'ru'
      ? '— Вселенная'
      : language === 'es'
        ? '— El Universo'
        : '— Universe';
  };

  // Handle typing completion
  const handleTypingComplete = () => {
    setTypingComplete(true);
  };

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
              <TypingEffect 
                text={dailyAdvice || ''} 
                speed={30} 
                className="text-white text-base font-sans leading-relaxed"
                onComplete={handleTypingComplete}
              />
              {typingComplete && (
                <p className="text-right text-sm text-cosmic-accent/80 mt-2 font-serif italic">
                  {getSignature()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
