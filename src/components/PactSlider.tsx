import React from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Pact } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

interface PactSliderProps {
  allPacts: Pact[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
}

export const PactSlider: React.FC<PactSliderProps> = ({
  allPacts,
  currentIndex,
  onIndexChange,
  className,
}) => {
  const { t } = useTranslations();

  if (allPacts.length <= 1) {
    return null;
  }

  const handleSliderChange = (values: number[]) => {
    const newIndex = values[0];
    onIndexChange(newIndex);
  };

  return (
    <div className={cn('w-full max-w-xs mx-auto', className)}>
      <div className="mb-4">
        <Slider
          value={[currentIndex]}
          onValueChange={handleSliderChange}
          max={allPacts.length - 1}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
      
      {/* Pact indicators */}
      <div className="flex justify-center space-x-2 mb-2">
        {allPacts.map((pact, index) => (
          <div
            key={pact.id}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-200',
              index === currentIndex
                ? 'bg-cosmic-accent scale-125'
                : pact.status === 'failed'
                  ? 'bg-red-500/50'
                  : pact.status === 'completed'
                    ? 'bg-green-500/50'
                    : 'bg-cosmic-secondary/50'
            )}
          />
        ))}
      </div>

      {/* Status indicator */}
      <div className="text-center text-xs text-cosmic-secondary">
        {currentIndex + 1} / {allPacts.length}
        {allPacts[currentIndex]?.status === 'failed' && (
          <span className="ml-2 text-red-400">
            {t.main?.failed || 'Прервана'}
          </span>
        )}
        {allPacts[currentIndex]?.status === 'completed' && (
          <span className="ml-2 text-green-400">
            {t.main?.completed || 'Завершена'}
          </span>
        )}
      </div>
    </div>
  );
};