import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  onBreakAscesis,
  getAscesisPrefix,
  formatRejection,
}) => {
  const { t } = useTranslations();
  const { language } = useAppStore();

  // Memoize current pact
  const currentPact = useMemo(() => pacts[currentPactIndex], [pacts, currentPactIndex]);

  // Memoize progress calculation
  const getPactProgress = useCallback((pact: Pact) => {
    const completedDays = pact.days.filter(day => day.completed).length;
    return Math.round((completedDays / pact.duration) * 100);
  }, []);

  // Memoize pact type name calculation
  const getPactTypeName = useCallback((pact: Pact) => {
    const typeLabel = pact.type === 'spiritual' 
      ? (language === 'ru' ? 'Духовная' : language === 'es' ? 'Espiritual' : 'Spiritual')
      : (language === 'ru' ? 'Физическая' : language === 'es' ? 'Física' : 'Physical');
    
    return `${typeLabel} • ${formatRejection(pact.title || '')}`;
  }, [language, formatRejection]);

  if (!currentPact) return null;

  // Always show single pact display with navigation
  return (
    <div className="w-full flex flex-col items-center space-y-6 relative z-50">
      <CountdownTimer pactId={currentPact.id} />
      
      <div className="text-center mb-4">
        <p className="text-sm text-foreground/80 mb-2">
          {getPactTypeName(currentPact)}
        </p>
        <h1 className="text-xl uppercase font-serif text-foreground mb-6 text-shadow-lg">
          {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
        </h1>
      </div>

      <div className="w-full overflow-visible px-4 flex justify-center">
        <EnergyCircle 
          progress={getPactProgress(currentPact)} 
          size="lg"
          status={currentPact.status}
        >
          <div className="text-center p-4">
            <p className={cn(
              "text-4xl font-bold font-serif",
              currentPact.status === 'failed' ? 'text-red-300' : 'text-foreground'
            )}>
              {currentPact.days.filter(day => day.completed).length}/{currentPact.duration}
            </p>
            <p className={cn(
              "text-lg mt-2",
              currentPact.status === 'failed' ? 'text-red-400' : 'text-cosmic-accent'
            )}>
              {t.main?.days || 'days'}
            </p>
          </div>
        </EnergyCircle>
      </div>

      {/* Navigation controls for multiple pacts */}
      {pacts.length > 1 && (
        <div className="flex items-center space-x-8 mt-6">
          <button
            onClick={() => onPactChange(currentPactIndex > 0 ? currentPactIndex - 1 : pacts.length - 1)}
            className="w-12 h-12 rounded-full bg-cosmic-primary/20 border border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-primary/30 transition-colors flex items-center justify-center"
          >
            ←
          </button>
          
          <div className="flex space-x-2">
            {pacts.map((pact, index) => (
              <div
                key={pact.id}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-200 cursor-pointer',
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
          
          <button
            onClick={() => onPactChange(currentPactIndex < pacts.length - 1 ? currentPactIndex + 1 : 0)}
            className="w-12 h-12 rounded-full bg-cosmic-primary/20 border border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-primary/30 transition-colors flex items-center justify-center"
          >
            →
          </button>
        </div>
      )}

      {/* Status indicator for multiple pacts */}
      {pacts.length > 1 && (
        <div className="text-center text-sm text-cosmic-secondary mt-2">
          {currentPactIndex + 1} / {pacts.length}
          {currentPact.status === 'failed' && (
            <span className="ml-2 text-red-400">
              {t.main?.failed || 'Прервана'}
            </span>
          )}
          {currentPact.status === 'completed' && (
            <span className="ml-2 text-green-400">
              {t.main?.completed || 'Завершена'}
            </span>
          )}
        </div>
      )}

      {currentPact.status === 'active' && (
        <button
          className="mt-8 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-colors"
          onClick={onBreakAscesis}
        >
          {language === 'ru'
            ? 'Прервать аскезу'
            : language === 'es'
              ? 'Romper ascesis'
              : 'Break asceticism'}
        </button>
      )}
    </div>
  );
};

// Export memoized component
export const AdaptivePactDisplay = React.memo(MemoizedAdaptivePactDisplay);