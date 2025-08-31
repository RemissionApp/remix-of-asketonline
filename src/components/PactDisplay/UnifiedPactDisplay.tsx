import React, { useState, useCallback, useMemo } from 'react';
import { EnergyCircle } from '../EnergyCircle';
import { UnifiedCountdownTimer } from './UnifiedCountdownTimer';
import { UnifiedNavigation } from './UnifiedNavigation';
import { UnifiedBreakButton } from './UnifiedBreakButton';
import { Pact } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { PACT_DISPLAY_CONSTANTS, PactStatus } from './constants';

interface UnifiedPactDisplayProps {
  pacts: Pact[];
  currentPactIndex: number;
  onPactChange: (index: number) => void;
  onBreakAscesis: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const UnifiedPactDisplay: React.FC<UnifiedPactDisplayProps> = ({
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

  // Memoize progress calculation using database fields
  const getPactProgress = useCallback((pact: Pact) => {
    // Prefer database fields for accuracy
    const completedDays = pact.days_completed ?? pact.days?.filter(day => day.completed).length ?? 0;
    const totalDays = pact.days_total ?? pact.duration ?? 1;
    
    return Math.round((completedDays / totalDays) * 100);
  }, []);

  // Memoize pact type name
  const getPactTypeName = useCallback((pact: Pact) => {
    const typeLabel = pact.type === 'spiritual' 
      ? (language === 'ru' ? 'Духовная' : language === 'es' ? 'Espiritual' : 'Spiritual')
      : (language === 'ru' ? 'Физическая' : language === 'es' ? 'Física' : 'Physical');
    
    return `${typeLabel} • ${formatRejection(pact.title || '')}`;
  }, [language, formatRejection]);

  // Get status colors
  const getStatusColors = useCallback((status: string) => {
    const pactStatus = status as PactStatus;
    return PACT_DISPLAY_CONSTANTS.STATUS_COLORS[pactStatus] || PACT_DISPLAY_CONSTANTS.STATUS_COLORS.active;
  }, []);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    const newIndex = currentPactIndex > 0 ? currentPactIndex - 1 : pacts.length - 1;
    onPactChange(newIndex);
  }, [currentPactIndex, pacts.length, onPactChange]);

  const handleNext = useCallback(() => {
    const newIndex = currentPactIndex < pacts.length - 1 ? currentPactIndex + 1 : 0;
    onPactChange(newIndex);
  }, [currentPactIndex, pacts.length, onPactChange]);

  if (!currentPact) return null;

  const statusColors = getStatusColors(currentPact.status);
  const progress = getPactProgress(currentPact);
  const completedDays = currentPact.days_completed ?? currentPact.days?.filter(day => day.completed).length ?? 0;
  const totalDays = currentPact.days_total ?? currentPact.duration ?? 1;

  return (
    <div 
      className="w-full flex flex-col items-center justify-center relative"
      style={{ 
        minHeight: 'auto',
        maxWidth: PACT_DISPLAY_CONSTANTS.CONTAINER.MAX_WIDTH 
      }}
    >
      {/* Timer */}
      <UnifiedCountdownTimer 
        pact={currentPact} 
        className="mb-2 sm:mb-3 md:mb-4 transition-all duration-300"
      />
      
      {/* Pact Information */}
      <div className="text-center mb-3 sm:mb-4 md:mb-6 px-2 sm:px-3 md:px-4">
        <p className={cn(
          "text-sm mb-2 transition-colors duration-300",
          statusColors.accent
        )}>
          {getPactTypeName(currentPact)}
        </p>
        <h1 className={cn(
          PACT_DISPLAY_CONSTANTS.TYPOGRAPHY.TITLE_SIZE,
          "uppercase font-serif mb-3 sm:mb-4 md:mb-6 text-shadow-lg transition-colors duration-300",
          statusColors.primary
        )}>
          {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
        </h1>
      </div>

      {/* Energy Circle */}
      <div className="w-full overflow-visible px-2 sm:px-3 md:px-4 flex justify-center mb-3 sm:mb-4 md:mb-6">
        <EnergyCircle 
          progress={progress} 
          size="sm"
          status={currentPact.status as any}
          className="transition-all duration-500 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
        >
          <div className="text-center p-2 sm:p-3 md:p-4">
            <p className={cn(
              PACT_DISPLAY_CONSTANTS.TYPOGRAPHY.PROGRESS_SIZE,
              "font-bold font-serif tabular-nums transition-colors duration-300",
              statusColors.primary
            )}>
              {completedDays}/{totalDays}
            </p>
            <p className={cn(
              PACT_DISPLAY_CONSTANTS.TYPOGRAPHY.COUNTER_SIZE,
              "mt-1 sm:mt-1.5 md:mt-2 transition-colors duration-300",
              statusColors.accent
            )}>
              {t.main?.days || 'days'}
            </p>
          </div>
        </EnergyCircle>
      </div>

      {/* Universal Navigation - Always reserve space */}
      <div 
        className="w-full flex justify-center"
        style={{ minHeight: PACT_DISPLAY_CONSTANTS.NAVIGATION_HEIGHT.MOBILE }}
      >
        <UnifiedNavigation
          pacts={pacts}
          currentIndex={currentPactIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onPactSelect={onPactChange}
        />
      </div>

      {/* Status Information */}
      {pacts.length > 1 && (
        <div className="text-center text-sm text-cosmic-secondary mt-2">
          {currentPactIndex + 1} / {pacts.length}
          {currentPact.status === 'failed' && (
            <span className="ml-2 text-red-400">
              {language === 'ru' ? 'Прервана' :
               language === 'es' ? 'Interrumpida' :
               'Failed'}
            </span>
          )}
          {currentPact.status === 'completed' && (
            <span className="ml-2 text-green-400">
              {language === 'ru' ? 'Завершена' :
               language === 'es' ? 'Completada' :
               'Completed'}
            </span>
          )}
        </div>
      )}

      {/* Break Ascesis Button - Always reserve space */}
      <div className="mt-3 sm:mt-4 md:mt-6 min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center">
        <UnifiedBreakButton
          pact={currentPact}
          onBreakAscesis={onBreakAscesis}
          language={language}
        />
      </div>
    </div>
  );
};