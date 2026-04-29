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
      <div className="glass-card mb-4 sm:mb-6">
        <div className="p-3 sm:p-4">
          <div className="flex items-center mb-2 sm:mb-3">
            <div className="glass-icon-wrap !p-1.5 sm:!p-2 !mr-2 sm:!mr-3">
              <LightbulbIcon
                size={18}
                className="text-cosmic-gold animate-pulse-slow"
              />
            </div>
            <h3
              className={`text-sm sm:text-base font-medium ${
                language === 'en' ? 'font-serif' : 'font-display'
              }`}
            >
              {language === 'ru'
                ? 'Совет дня'
                : language === 'es'
                  ? 'Consejo del día'
                  : 'Daily Advice'}
            </h3>
          </div>

          {isLoading ? (
            <Skeleton className="h-12 sm:h-14 w-full bg-cosmic-accent/10 rounded-md" />
          ) : (
            <div className="px-1 py-1 sm:py-2">
              <p className="text-white text-sm sm:text-base font-sans leading-snug sm:leading-relaxed text-center">
                {dailyAdvice}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
