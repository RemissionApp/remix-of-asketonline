import React, { useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Pact } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { PACT_DISPLAY_CONSTANTS } from './constants';

interface UnifiedNavigationProps {
  pacts: Pact[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onPactSelect: (index: number) => void;
}

export const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  pacts,
  currentIndex,
  onPrevious,
  onNext,
  onPactSelect,
}) => {
  const { language } = useAppStore();

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        onPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onNext();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        // Could trigger some action on current pact
        break;
    }
  }, [onPrevious, onNext]);

  // Get dot color and tooltip based on pact status
  const getDotColor = useCallback((pact: Pact, isActive: boolean) => {
    if (isActive) return 'bg-cosmic-accent scale-125 shadow-lg shadow-cosmic-accent/30';
    
    switch (pact.status) {
      case 'failed':
        return 'bg-red-500/70 hover:bg-red-500/90';
      case 'completed':
        return 'bg-green-500/70 hover:bg-green-500/90';
      case 'planned':
        return 'bg-cosmic-secondary/30 hover:bg-cosmic-secondary/50';
      default:
        return 'bg-cosmic-secondary/50 hover:bg-cosmic-secondary/70';
    }
  }, []);

  // Get tooltip text for pact status
  const getStatusTooltip = useCallback((pact: Pact) => {
    const completedDays = pact.days_completed ?? pact.days?.filter(day => day.completed).length ?? 0;
    const totalDays = pact.days_total ?? pact.duration ?? 1;
    const progress = Math.round((completedDays / totalDays) * 100);

    const statusText = {
      ru: {
        active: 'Активная',
        completed: 'Завершена',
        failed: 'Прервана',
        planned: 'Запланирована'
      },
      es: {
        active: 'Activa',
        completed: 'Completada',
        failed: 'Interrumpida',
        planned: 'Planificada'
      },
      en: {
        active: 'Active',
        completed: 'Completed',
        failed: 'Failed',
        planned: 'Planned'
      }
    }[language] || {
      active: 'Active',
      completed: 'Completed',
      failed: 'Failed',
      planned: 'Planned'
    };

    return `${pact.title} - ${statusText[pact.status]} (${completedDays}/${totalDays} дней - ${progress}%)`;
  }, [language]);

  // Single pact: show create new pact placeholder
  if (pacts.length <= 1) {
    return (
      <div className="flex items-center justify-center space-x-4">
        <button
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
            "bg-cosmic-primary/10 border border-cosmic-accent/20",
            "text-cosmic-secondary hover:text-cosmic-accent",
            "hover:bg-cosmic-primary/20 hover:border-cosmic-accent/30"
          )}
          style={{ 
            height: PACT_DISPLAY_CONSTANTS.NAVIGATION.BUTTON_SIZE,
            transition: `all ${PACT_DISPLAY_CONSTANTS.ANIMATIONS.BUTTON_HOVER}ms ease`
          }}
        >
          <Plus size={16} />
          <span className="text-sm">
            {language === 'ru' ? 'Создать еще одну' :
             language === 'es' ? 'Crear otra' :
             'Create another'}
          </span>
        </button>
      </div>
    );
  }

  // Multiple pacts: show full navigation
  return (
    <div 
      className="flex items-center space-x-8"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="navigation"
      aria-label="Pact navigation"
    >
      {/* Previous button */}
      <button
        onClick={onPrevious}
        className={cn(
          "rounded-full flex items-center justify-center transition-all",
          "bg-cosmic-primary/20 border border-cosmic-accent/30",
          "text-cosmic-accent hover:bg-cosmic-primary/30",
          "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
        )}
        style={{ 
          width: PACT_DISPLAY_CONSTANTS.NAVIGATION.BUTTON_SIZE,
          height: PACT_DISPLAY_CONSTANTS.NAVIGATION.BUTTON_SIZE,
          transition: `all ${PACT_DISPLAY_CONSTANTS.ANIMATIONS.BUTTON_HOVER}ms ease`
        }}
        aria-label="Previous pact"
      >
        <ChevronLeft size={20} />
      </button>
      
      {/* Pact indicators */}
      <div 
        className="flex items-center"
        style={{ gap: PACT_DISPLAY_CONSTANTS.NAVIGATION.DOT_SPACING }}
      >
        {pacts.map((pact, index) => (
          <button
            key={pact.id}
            className={cn(
              'rounded-full transition-all duration-200 cursor-pointer relative',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50',
              getDotColor(pact, index === currentIndex)
            )}
            style={{ 
              width: PACT_DISPLAY_CONSTANTS.NAVIGATION.DOT_SIZE,
              height: PACT_DISPLAY_CONSTANTS.NAVIGATION.DOT_SIZE,
              transition: `all ${PACT_DISPLAY_CONSTANTS.ANIMATIONS.BUTTON_HOVER}ms ease`
            }}
            onClick={() => onPactSelect(index)}
            aria-label={`Go to pact ${index + 1}: ${pact.title}`}
            title={getStatusTooltip(pact)}
          >
            {/* Status indicator ring for active pact */}
            {index === currentIndex && pact.status === 'active' && (
              <div className="absolute inset-0 rounded-full border-2 border-cosmic-accent animate-pulse" />
            )}
          </button>
        ))}
      </div>
      
      {/* Next button */}
      <button
        onClick={onNext}
        className={cn(
          "rounded-full flex items-center justify-center transition-all",
          "bg-cosmic-primary/20 border border-cosmic-accent/30",
          "text-cosmic-accent hover:bg-cosmic-primary/30",
          "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
        )}
        style={{ 
          width: PACT_DISPLAY_CONSTANTS.NAVIGATION.BUTTON_SIZE,
          height: PACT_DISPLAY_CONSTANTS.NAVIGATION.BUTTON_SIZE,
          transition: `all ${PACT_DISPLAY_CONSTANTS.ANIMATIONS.BUTTON_HOVER}ms ease`
        }}
        aria-label="Next pact"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};