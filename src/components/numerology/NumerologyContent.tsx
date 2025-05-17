
import React, { useEffect, useState } from 'react';
import { CosmicButton } from '../CosmicButton';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface NumerologyContentProps {
  lifePathNumber: number;
  title: string;
  description: string;
  moreDetailsText: string;
}

export const NumerologyContent: React.FC<NumerologyContentProps> = ({
  lifePathNumber,
  title,
  description,
  moreDetailsText
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleMoreDetails = () => {
    navigate('/numerology');
  };

  return (
    <div 
      className={cn(
        "cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full max-w-lg mx-auto transition-all duration-700 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent">
        <div className={cn(
          "flex items-center mb-3 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        )}>
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3 animate-glow-pulse">
            <span className="text-3xl">{lifePathNumber}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cosmic-accent">
              {title}
            </h3>
            <p className="text-sm text-cosmic-secondary">
              {moreDetailsText}: {lifePathNumber}
            </p>
          </div>
        </div>
        
        <div className={cn(
          "mt-4 text-center transition-all duration-500 delay-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-cosmic-secondary mt-2">{description}</p>
        </div>
        
        <div className={cn(
          "mt-4 flex justify-center transition-all duration-500 delay-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <button 
            onClick={handleMoreDetails} 
            className="flex items-center justify-center px-4 py-2 mt-2 bg-black border border-cosmic-gold/40 rounded-none"
          >
            <Star className="mr-2 w-4 h-4 text-cosmic-gold" />
            <span className="text-cosmic-gold">{moreDetailsText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
