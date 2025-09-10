import React from 'react';
import { LightbulbIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/skeleton';
import { UserGreetingSection } from '@/components/MainPageComponents/UserGreetingSection';
import { useDailyAdvice } from '@/hooks/useDailyAdvice';

export const DailyAdviceDisplay: React.FC = () => {
  const { language } = useAppStore();
  const { dailyAdvice, isLoading } = useDailyAdvice(language);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-8">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
              <LightbulbIcon
                size={20}
                className="text-cosmic-gold animate-pulse-slow"
              />
            </div>
            <h3
              className={
                language === 'en'
                  ? 'font-serif font-medium'
                  : 'font-sans font-medium'
              }
            >
              {language === 'ru'
                ? 'Совет дня'
                : language === 'es'
                  ? 'Consejo del día'
                  : 'Daily Advice'}
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
