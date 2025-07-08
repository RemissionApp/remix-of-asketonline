
import React from 'react';
import { ChevronLeft, ChevronRight, Heart, Zap, Shield, Star, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Pact } from '@/types';

interface PactNavigationProps {
  currentIndex: number;
  totalPacts: number;
  pacts: Pact[];
  onPrevious: () => void;
  onNext: () => void;
}

const getPactIcon = (pactType?: string) => {
  switch (pactType?.toLowerCase()) {
    case 'health':
    case 'здоровье':
      return Heart;
    case 'energy':
    case 'энергия':
      return Zap;
    case 'protection':
    case 'защита':
      return Shield;
    case 'spiritual':
    case 'духовная':
      return Star;
    default:
      return Target;
  }
};

export const PactNavigation: React.FC<PactNavigationProps> = ({ 
  currentIndex, 
  totalPacts,
  pacts,
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
      <div className="flex space-x-3">
        {pacts.map((pact, index) => {
          const IconComponent = getPactIcon(pact.type);
          return (
            <div 
              key={pact.id}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                index === currentIndex 
                  ? "bg-cosmic-accent/20 border-cosmic-accent text-cosmic-accent" 
                  : "bg-cosmic-dark/40 border-cosmic-accent/30 text-cosmic-accent/60 hover:border-cosmic-accent/60"
              )}
            >
              <IconComponent size={16} />
            </div>
          );
        })}
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
