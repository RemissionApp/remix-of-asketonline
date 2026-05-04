import React from 'react';
import { LightbulbIcon, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useDailyAdvice } from '@/hooks/useDailyAdvice';
import { Button } from '@/components/ui/button';

export const DailyAdviceDisplay: React.FC = () => {
  const { language } = useAppStore();
  const { dailyAdvice, isLoading } = useDailyAdvice(language);
  const title =
    language === 'ru' ? 'Совет дня' : language === 'es' ? 'Consejo del día' : 'Daily Advice';
  const action =
    language === 'ru' ? 'Принять совет' : language === 'es' ? 'Tomar el consejo' : 'Take the guidance';

  return (
    <div className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-indigo/35 via-cosmic-dark/60 to-cosmic-accent/25 p-5 text-left shadow-lg shadow-cosmic-accent/20">
      <div className="flex items-start gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-gold/70 to-cosmic-accent/60 shadow-[0_0_30px_rgba(232,193,108,0.35)]">
          <Sparkles className="absolute h-8 w-8 text-white/15" />
          <LightbulbIcon size={28} className="relative text-white" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <div className="text-base font-semibold text-white">{title}</div>
            <div className="mt-0.5 text-xs text-cosmic-secondary">
              {language === 'ru'
                ? 'Короткий вектор на сегодняшний день'
                : language === 'es'
                  ? 'Una dirección breve para hoy'
                  : 'A short direction for today'}
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-14 w-full rounded-2xl bg-cosmic-accent/10" />
          ) : (
            <p className="text-sm leading-relaxed text-white/90">{dailyAdvice}</p>
          )}

          <Button
            variant="outline"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
};
