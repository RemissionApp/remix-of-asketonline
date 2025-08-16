import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export const useDailyAdvice = (language: string) => {
  const [dailyAdvice, setDailyAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        const { data, error } = await supabase.functions.invoke(
          'generate-daily-advice',
          {
            body: { language },
          }
        );

        if (error) {
          console.error('Error generating daily advice:', error);
          throw new Error(error.message);
        }

        let generatedAdvice = '';
        if (data && typeof data === 'object' && 'advice' in data) {
          generatedAdvice = data.advice;
        } else if (typeof data === 'string') {
          generatedAdvice = data;
        } else {
          throw new Error(
            'Invalid response format from generate-daily-advice function'
          );
        }

        // Save to local storage
        localStorage.setItem(cachedAdviceKey, generatedAdvice);
        setDailyAdvice(generatedAdvice);
      } catch (error) {
        console.error('Error:', error);
        // Fallback advice
        const fallbackAdvice =
          language === 'ru'
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
  }, [language]);

  return {
    dailyAdvice,
    isLoading,
  };
};
