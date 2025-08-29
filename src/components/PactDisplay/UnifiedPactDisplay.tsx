import React, { useState, useCallback, useMemo } from 'react';
import { EnergyCircle } from '../EnergyCircle';
import { UnifiedCountdownTimer } from './UnifiedCountdownTimer';
import { UnifiedNavigation } from './UnifiedNavigation';
import { UnifiedBreakButton } from './UnifiedBreakButton';
import { PactStats, usePactStats } from './PactStats';
import { PactStatusMessage } from './PactStatusMessage';
import { Pact } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { PACT_DISPLAY_CONSTANTS, PactStatus } from './constants';
import { useNavigate } from 'react-router-dom';

interface UnifiedPactDisplayProps {
  pacts: Pact[];
  currentPactIndex: number;
  onPactChange: (index: number) => void;
  onBreakAscesis: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
  showStats?: boolean;
  statsVariant?: 'compact' | 'full' | 'mini';
}

export const UnifiedPactDisplay: React.FC<UnifiedPactDisplayProps> = ({
  pacts,
  currentPactIndex,
  onPactChange,
  onBreakAscesis,
  getAscesisPrefix,
  formatRejection,
  showStats = true,
  statsVariant = 'compact'
}) => {
  const { t } = useTranslations();
  const { language } = useAppStore();
  const navigate = useNavigate();

  // Calculate pact statistics
  const stats = usePactStats(pacts);
  const activePacts = pacts.filter(p => p.status === 'active');

  // Memoize current pact
  const memoizedCurrentPact = useMemo(() => pacts[currentPactIndex], [pacts, currentPactIndex]);

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

  // Handle navigation to pacts page
  const handleCreatePact = () => {
    navigate('/pacts');
  };

  // If no pacts, show empty state
  if (pacts.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto">
        {showStats && (
          <PactStats 
            pacts={pacts} 
            variant={statsVariant}
            className="mb-6"
          />
        )}
        <PactStatusMessage 
          stats={stats}
          onCreatePact={handleCreatePact}
        />
      </div>
    );
  }

  // If no active pacts but has completed/failed ones
  if (activePacts.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto">
        {showStats && (
          <PactStats 
            pacts={pacts} 
            variant={statsVariant}
            className="mb-6"
          />
        )}
        <PactStatusMessage 
          stats={stats}
          onCreatePact={handleCreatePact}
          className="mb-6"
        />
        
        {/* Show completed/failed pacts for reference */}
        {pacts.length > 0 && (
          <div className="text-center mb-4">
            <p className="text-cosmic-secondary text-sm mb-3">
              {language === 'ru' ? 'История аскез:' :
               language === 'es' ? 'Historial de ascesis:' :
               'Ascesis history:'}
            </p>
            <UnifiedNavigation
              pacts={pacts}
              currentIndex={currentPactIndex}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onPactSelect={onPactChange}
            />
          </div>
        )}
      </div>
    );
  }

  if (!memoizedCurrentPact) return null;

  const statusColors = getStatusColors(memoizedCurrentPact.status);
  const progress = getPactProgress(memoizedCurrentPact);
  const completedDays = memoizedCurrentPact.days_completed ?? memoizedCurrentPact.days?.filter(day => day.completed).length ?? 0;
  const totalDays = memoizedCurrentPact.days_total ?? memoizedCurrentPact.duration ?? 1;

  return (
    <div 
      className="w-full flex flex-col items-center relative"
      style={{ 
        minHeight: PACT_DISPLAY_CONSTANTS.CONTAINER.HEIGHT.MOBILE,
        maxWidth: PACT_DISPLAY_CONSTANTS.CONTAINER.MAX_WIDTH 
      }}
    >
      {/* Pact Statistics */}
      {showStats && (
        <div className="w-full mb-4">
          <PactStats 
            pacts={pacts} 
            variant={statsVariant}
          />
        </div>
      )}
      {/* Timer */}
      <UnifiedCountdownTimer 
        pact={memoizedCurrentPact} 
        className="mb-2 sm:mb-3 md:mb-4 transition-all duration-300"
      />
      
      {/* Pact Information */}
      <div className="text-center mb-3 sm:mb-4 md:mb-6 px-2 sm:px-3 md:px-4">
        <p className={cn(
          "text-sm mb-2 transition-colors duration-300",
          statusColors.accent
        )}>
          {getPactTypeName(memoizedCurrentPact)}
        </p>
        <h1 className={cn(
          PACT_DISPLAY_CONSTANTS.TYPOGRAPHY.TITLE_SIZE,
          "uppercase font-serif mb-3 sm:mb-4 md:mb-6 text-shadow-lg transition-colors duration-300",
          statusColors.primary
        )}>
          {`${getAscesisPrefix()} ${formatRejection(memoizedCurrentPact.title || '')}`}
        </h1>
      </div>

      {/* Energy Circle */}
      <div className="w-full overflow-visible px-2 sm:px-3 md:px-4 flex justify-center mb-3 sm:mb-4 md:mb-6">
        <EnergyCircle 
          progress={progress} 
          size="sm"
          status={memoizedCurrentPact.status as any}
          className="transition-all duration-500 sm:w-48 sm:h-48 md:w-64 md:w-64 lg:w-80 lg:h-80"
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
          {memoizedCurrentPact.status === 'failed' && (
            <span className="ml-2 text-red-400">
              {language === 'ru' ? 'Прервана' :
               language === 'es' ? 'Interrumpida' :
               'Failed'}
            </span>
          )}
          {memoizedCurrentPact.status === 'completed' && (
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
          pact={memoizedCurrentPact}
          onBreakAscesis={onBreakAscesis}
          language={language}
        />
      </div>
    </div>
  );
};