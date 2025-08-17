import React, { useState, useEffect, useCallback } from 'react';
import { EnergyCircle } from './EnergyCircle';
import { CountdownTimer } from './CountdownTimer';
import { CosmicButton } from './CosmicButton';
import { Pact } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';

interface AdaptivePactDisplayProps {
  pacts: Pact[];
  currentPactIndex: number;
  onPactChange: (index: number) => void;
  onBreakAscesis: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const AdaptivePactDisplay: React.FC<AdaptivePactDisplayProps> = ({
  pacts,
  currentPactIndex,
  onPactChange,
  onBreakAscesis,
  getAscesisPrefix,
  formatRejection,
}) => {
  const { t } = useTranslations();
  const { language } = useAppStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    containScroll: 'trimSnaps',
    skipSnaps: false,
    startIndex: currentPactIndex
  });

  const currentPact = pacts[currentPactIndex];

  // Update embla when currentPactIndex changes externally
  useEffect(() => {
    if (emblaApi && pacts.length > 3) {
      emblaApi.scrollTo(currentPactIndex);
    }
  }, [emblaApi, currentPactIndex, pacts.length]);

  // Handle embla selection changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    if (selectedIndex !== currentPactIndex) {
      onPactChange(selectedIndex);
    }
  }, [emblaApi, currentPactIndex, onPactChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handlePactClick = (index: number) => {
    onPactChange(index);
  };

  const getCircleSize = () => {
    if (pacts.length === 1) return 'lg';
    if (pacts.length === 2) return 'md';
    return 'sm';
  };

  const getPactProgress = (pact: Pact) => {
    const completedDays = pact.days.filter(day => day.completed).length;
    return Math.round((completedDays / pact.duration) * 100);
  };

  const getPactTypeName = (pact: Pact) => {
    const typeLabel = pact.type === 'spiritual' 
      ? (language === 'ru' ? 'Духовная' : language === 'es' ? 'Espiritual' : 'Spiritual')
      : (language === 'ru' ? 'Физическая' : language === 'es' ? 'Física' : 'Physical');
    
    return `${typeLabel} • ${formatRejection(pact.title || '')}`;
  };

  if (!currentPact) return null;

  // Single pact display
  if (pacts.length === 1) {
    return (
      <div className="w-full flex flex-col items-center space-y-6">
        <CountdownTimer pactId={currentPact.id} />
        
        <div className="text-center">
          <p className="text-sm text-cosmic-secondary mb-2">
            {getPactTypeName(currentPact)}
          </p>
          <h1 className="text-xl uppercase font-serif text-white mb-6">
            {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
          </h1>
        </div>

        <EnergyCircle 
          progress={getPactProgress(currentPact)} 
          size="lg"
          status={currentPact.status}
        >
          <div className="text-center p-4">
            <p className={cn(
              "text-4xl font-bold font-serif",
              currentPact.status === 'failed' ? 'text-red-300' : 'text-white'
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

        {currentPact.status === 'active' && (
          <CosmicButton
            className="mt-8"
            variant="destructive"
            onClick={onBreakAscesis}
          >
            <X size={16} />
            {language === 'ru'
              ? 'Прервать аскезу'
              : language === 'es'
                ? 'Romper ascesis'
                : 'Break asceticism'}
          </CosmicButton>
        )}
      </div>
    );
  }

  // Two pacts display
  if (pacts.length === 2) {
    return (
      <div className="w-full flex flex-col items-center space-y-6">
        <CountdownTimer pactId={currentPact.id} />
        
        <div className="text-center">
          <h1 className="text-lg uppercase font-serif text-white mb-6">
            {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
          </h1>
        </div>

        <div className="flex items-center justify-center space-x-8">
          {pacts.map((pact, index) => (
            <div 
              key={pact.id} 
              className={cn(
                "flex flex-col items-center transition-all duration-300",
                index === currentPactIndex ? 'scale-110' : 'scale-90 opacity-70'
              )}
            >
              <p className="text-xs text-cosmic-secondary mb-2 text-center max-w-32">
                {getPactTypeName(pact)}
              </p>
              <EnergyCircle 
                progress={getPactProgress(pact)} 
                size="md"
                status={pact.status}
                onClick={() => handlePactClick(index)}
                className="cursor-pointer"
              >
                <div className="text-center p-3">
                  <p className={cn(
                    "text-2xl font-bold font-serif",
                    pact.status === 'failed' ? 'text-red-300' : 'text-white'
                  )}>
                    {pact.days.filter(day => day.completed).length}/{pact.duration}
                  </p>
                  <p className={cn(
                    "text-sm mt-1",
                    pact.status === 'failed' ? 'text-red-400' : 'text-cosmic-accent'
                  )}>
                    {t.main?.days || 'days'}
                  </p>
                </div>
              </EnergyCircle>
            </div>
          ))}
        </div>

        {currentPact.status === 'active' && (
          <CosmicButton
            className="mt-8"
            variant="destructive"
            onClick={onBreakAscesis}
          >
            <X size={16} />
            {language === 'ru'
              ? 'Прервать аскезу'
              : language === 'es'
                ? 'Romper ascesis'
                : 'Break asceticism'}
          </CosmicButton>
        )}
      </div>
    );
  }

  // Three pacts display
  if (pacts.length === 3) {
    return (
      <div className="w-full flex flex-col items-center space-y-6">
        <CountdownTimer pactId={currentPact.id} />
        
        <div className="text-center">
          <h1 className="text-lg uppercase font-serif text-white mb-6">
            {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center justify-center max-w-md">
          {pacts.map((pact, index) => (
            <div 
              key={pact.id} 
              className={cn(
                "flex flex-col items-center transition-all duration-300",
                index === currentPactIndex ? 'scale-110' : 'scale-90 opacity-70'
              )}
            >
              <p className="text-xs text-cosmic-secondary mb-2 text-center">
                {getPactTypeName(pact)}
              </p>
              <EnergyCircle 
                progress={getPactProgress(pact)} 
                size="sm"
                status={pact.status}
                onClick={() => handlePactClick(index)}
                className="cursor-pointer"
              >
                <div className="text-center p-2">
                  <p className={cn(
                    "text-lg font-bold font-serif",
                    pact.status === 'failed' ? 'text-red-300' : 'text-white'
                  )}>
                    {pact.days.filter(day => day.completed).length}/{pact.duration}
                  </p>
                  <p className={cn(
                    "text-xs mt-1",
                    pact.status === 'failed' ? 'text-red-400' : 'text-cosmic-accent'
                  )}>
                    {t.main?.days || 'days'}
                  </p>
                </div>
              </EnergyCircle>
            </div>
          ))}
        </div>

        {currentPact.status === 'active' && (
          <CosmicButton
            className="mt-8"
            variant="destructive"
            onClick={onBreakAscesis}
          >
            <X size={16} />
            {language === 'ru'
              ? 'Прервать аскезу'
              : language === 'es'
                ? 'Romper ascesis'
                : 'Break asceticism'}
          </CosmicButton>
        )}
      </div>
    );
  }

  // Four or more pacts - slider display
  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <CountdownTimer pactId={currentPact.id} />
      
      <div className="text-center">
        <h1 className="text-lg uppercase font-serif text-white mb-6">
          {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
        </h1>
      </div>

      <div className="w-full max-w-sm">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {pacts.map((pact, index) => (
              <div 
                key={pact.id}
                className={cn(
                  "embla__slide flex-[0_0_33.333%] flex flex-col items-center transition-all duration-300",
                  index === currentPactIndex ? 'scale-110' : 'scale-90 opacity-70'
                )}
              >
                <p className="text-xs text-cosmic-secondary mb-2 text-center">
                  {getPactTypeName(pact)}
                </p>
                <EnergyCircle 
                  progress={getPactProgress(pact)} 
                  size="sm"
                  status={pact.status}
                  onClick={() => handlePactClick(index)}
                  className="cursor-pointer"
                >
                  <div className="text-center p-2">
                    <p className={cn(
                      "text-lg font-bold font-serif",
                      pact.status === 'failed' ? 'text-red-300' : 'text-white'
                    )}>
                      {pact.days.filter(day => day.completed).length}/{pact.duration}
                    </p>
                    <p className={cn(
                      "text-xs mt-1",
                      pact.status === 'failed' ? 'text-red-400' : 'text-cosmic-accent'
                    )}>
                      {t.main?.days || 'days'}
                    </p>
                  </div>
                </EnergyCircle>
              </div>
            ))}
          </div>
        </div>

        {/* Pact indicators */}
        <div className="flex justify-center space-x-2 mt-4">
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
              onClick={() => handlePactClick(index)}
            />
          ))}
        </div>

        {/* Status indicator */}
        <div className="text-center text-xs text-cosmic-secondary mt-2">
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
      </div>

      {currentPact.status === 'active' && (
        <CosmicButton
          className="mt-8"
          variant="destructive"
          onClick={onBreakAscesis}
        >
          <X size={16} />
          {language === 'ru'
            ? 'Прервать аскезу'
            : language === 'es'
              ? 'Romper ascesis'
              : 'Break asceticism'}
        </CosmicButton>
      )}
    </div>
  );
};