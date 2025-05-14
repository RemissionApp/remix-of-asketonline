
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PactNavigationProps {
  currentIndex: number;
  totalPacts: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PactNavigation: React.FC<PactNavigationProps> = ({ 
  currentIndex, 
  totalPacts, 
  onPrevious, 
  onNext 
}) => {
  if (totalPacts <= 1) return null;
  
  return (
    <div className="mb-4 flex items-center justify-center">
      <button 
        onClick={onPrevious} 
        className="text-cosmic-accent p-1 mr-2"
        aria-label="Previous pact"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex space-x-1">
        {Array.from({ length: totalPacts }).map((_, index) => (
          <div 
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              index === currentIndex 
                ? "bg-cosmic-accent" 
                : "bg-cosmic-accent/30"
            )}
          />
        ))}
      </div>
      <button 
        onClick={onNext} 
        className="text-cosmic-accent p-1 ml-2"
        aria-label="Next pact"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
