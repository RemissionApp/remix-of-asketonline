import React from 'react';
import { LightbulbIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useDailyAdvice } from '@/hooks/useDailyAdvice';
import { GlassCard } from '@/components/ui/GlassCard';

export const DailyAdviceDisplay: React.FC = () => {
  const { language } = useAppStore();
  const { dailyAdvice, isLoading } = useDailyAdvice(language);
  const title =
    language === 'ru' ? 'Совет дня' : language === 'es' ? 'Consejo del día' : 'Daily Advice';
  const subtitle =
    language === 'ru'
      ? 'Короткий вектор на сегодняшний день'
      : language === 'es'
        ? 'Una dirección breve para hoy'
        : 'A short direction for today';

  return (
    <div className="w-full max-w-lg mx-auto">
      <GlassCard
        icon={LightbulbIcon}
        variant="amber"
        title={title}
        subtitle={subtitle}
        showChevron={false}
      >
        {isLoading ? (
          <Skeleton className="h-14 w-full rounded-2xl bg-cosmic-accent/10" />
        ) : (
          <p className="text-sm leading-relaxed text-white/85 text-justify">{dailyAdvice}</p>
        )}
      </GlassCard>
    </div>
  );
};
