import React, { useCallback, useMemo } from 'react';
import { EnergyCircle } from './EnergyCircle';
import { CountdownTimer } from './CountdownTimer';
import { Pact } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface AdaptivePactDisplayProps {
  pacts: Pact[];
  currentPactIndex: number;
  onPactChange: (index: number) => void;
  onBreakAscesis: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

const MemoizedAdaptivePactDisplay: React.FC<AdaptivePactDisplayProps> = ({
  pacts,
  currentPactIndex,
  onPactChange,
  getAscesisPrefix,
  formatRejection,
}) => {
  const { t } = useTranslations();
  const { language } = useAppStore();

  const currentPact = useMemo(() => pacts[currentPactIndex], [pacts, currentPactIndex]);

  const getPactProgress = useCallback((pact: Pact) => {
    const completedDays = pact.days.filter(day => day.completed).length;
    return Math.round((completedDays / pact.duration) * 100);
  }, []);

  const getPactTypeName = useCallback((pact: Pact) => {
    const typeLabel = pact.type === 'spiritual'
      ? (language === 'ru' ? 'Духовная' : language === 'es' ? 'Espiritual' : 'Spiritual')
      : (language === 'ru' ? 'Физическая' : language === 'es' ? 'Física' : 'Physical');
    return `${typeLabel} • ${formatRejection(pact.title || '')}`;
  }, [language, formatRejection]);

  if (!currentPact) return null;

  return (
    <div className="w-full flex flex-col items-center gap-3 relative z-50">
      <CountdownTimer pactId={currentPact.id} />

      <div className="text-center">
        <p className="text-xs text-foreground/70 mb-1">
          {getPactTypeName(currentPact)}
        </p>
        <h1 className="text-base sm:text-lg uppercase font-serif text-foreground text-shadow-lg">
          {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
        </h1>
      </div>

      <div className="flex justify-center">
        <EnergyCircle
          progress={getPactProgress(currentPact)}
          size="md"
          status={currentPact.status}
        >
          <div className="text-center p-2">
            <p className={cn(
              'text-2xl font-bold font-serif',
              currentPact.status === 'failed' ? 'text-red-300' : 'text-foreground'
            )}>
              {currentPact.days.filter(day => day.completed).length}/{currentPact.duration}
            </p>
            <p className={cn(
              'text-xs mt-1',
              currentPact.status === 'failed' ? 'text-red-400' : 'text-cosmic-accent'
            )}>
              {t.main?.days || 'days'}
            </p>
          </div>
        </EnergyCircle>
      </div>

      {pacts.length > 1 && (
        <div className="flex space-x-2">
          {pacts.map((pact, index) => (
            <div
              key={pact.id}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200 cursor-pointer',
                index === currentPactIndex
                  ? 'bg-cosmic-accent scale-125'
                  : pact.status === 'failed'
                    ? 'bg-red-500/50'
                    : pact.status === 'completed'
                      ? 'bg-green-500/50'
                      : 'bg-cosmic-secondary/50'
              )}
              onClick={() => onPactChange(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AdaptivePactDisplay = React.memo(MemoizedAdaptivePactDisplay);
