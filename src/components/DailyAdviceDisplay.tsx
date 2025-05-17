
import React, { useEffect, useState } from 'react';
import { Calendar, LightbulbIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';

export const DailyAdviceDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const [dailyAdvice, setDailyAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          prompt = `Дай один практичный и вдохновляющий совет дня для ${name}. Совет должен быть коротким (не более 2-3 предложений), мотивирующим и содержать элемент духовности или самопознания. Не упоминай имя в ответе. Не называй это "советом дня".`;
        } else if (language === 'es') {
          prompt = `Da un consejo práctico e inspirador para ${name} hoy. El consejo debe ser breve (no más de 2-3 oraciones), motivador y contener un elemento de espiritualidad o autoconocimiento. No menciones el nombre en la respuesta. No lo llames "consejo del día".`;
        } else {
          prompt = `Give one practical and inspiring daily advice for ${name}. The advice should be short (no more than 2-3 sentences), motivating and contain an element of spirituality or self-discovery. Don't mention the name in the response. Don't call it a "daily advice".`;
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

  // Определяем имя для приветствия
  const userName = userProfile?.name || (language === 'ru' ? 'Искатель' : language === 'es' ? 'Buscador' : 'Seeker');

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Приветствие пользователя над карточкой совета дня - обновлено на две строки */}
      <div className="mb-3 text-center">
        <h2 className="text-cosmic-gold font-cormorant text-2xl animate-glow-pulse">
          {language === 'ru' 
            ? "Приветствую тебя!" 
            : language === 'es'
              ? "¡Te saludo!"
              : "Greetings!"}
        </h2>
        <h3 className="text-cosmic-gold font-cormorant text-xl mt-1 animate-glow-pulse">
          {userName}
        </h3>
      </div>
      
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/70 backdrop-blur-sm mb-6 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cosmic-accent/20 mr-3">
              <LightbulbIcon size={20} className="text-cosmic-accent" />
            </div>
            <h3 className="text-cosmic-accent font-medium">
              {language === 'ru' ? 'Совет дня' : language === 'es' ? 'Consejo del día' : 'Daily Advice'}
            </h3>
          </div>

          {isLoading ? (
            <Skeleton className="h-14 w-full bg-cosmic-accent/10 rounded-md" />
          ) : (
            <div className="px-1 py-2">
              <p className="text-cosmic-secondary text-base font-cormorant italic leading-relaxed">
                {dailyAdvice}
              </p>
              <div className="flex items-center justify-end mt-3">
                <Calendar size={12} className="text-cosmic-gold/60 mr-1" />
                <span className="text-cosmic-gold/60 text-xs">
                  {new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US', { 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
