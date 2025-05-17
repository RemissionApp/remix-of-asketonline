
import React, { useEffect, useState } from 'react';
import { CosmicButton } from '../CosmicButton';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface NumerologyContentProps {
  lifePathNumber: number;
  expressionNumber: number;
  personalityNumber: number;
  title: string;
  description: string;
  lifePathText: string;
  expressionText: string;
  personalityText: string;
  moreDetailsText: string;
}

export const NumerologyContent: React.FC<NumerologyContentProps> = ({
  lifePathNumber,
  expressionNumber,
  personalityNumber,
  title,
  description,
  lifePathText,
  expressionText,
  personalityText,
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
        "transition-all duration-700 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="w-full rounded-lg backdrop-blur-sm bg-transparent">
        {/* Life Path Number */}
        <div className={cn(
          "flex items-center mb-3 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        )}>
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3 animate-glow-pulse">
            <span className="text-3xl">{lifePathNumber}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cosmic-accent">
              {lifePathText}
            </h3>
            <p className="text-sm text-cosmic-secondary">
              {title}
            </p>
          </div>
        </div>
        
        {/* Expression Number */}
        <div className={cn(
          "flex items-center mb-3 transition-all duration-500 delay-400",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        )}>
          <div className="bg-cosmic-gold/20 rounded-lg p-2 mr-3">
            <span className="text-2xl text-cosmic-gold">{expressionNumber}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-cosmic-gold">
              {expressionText}
            </h3>
            <p className="text-xs text-cosmic-secondary">
              {expressionNumber === 1 ? "Лидерские качества" : 
               expressionNumber === 2 ? "Гармония и дипломатия" :
               expressionNumber === 3 ? "Творческое самовыражение" :
               expressionNumber === 4 ? "Стабильность и организованность" :
               expressionNumber === 5 ? "Свобода и приключения" :
               expressionNumber === 6 ? "Ответственность и забота" :
               expressionNumber === 7 ? "Мудрость и анализ" :
               expressionNumber === 8 ? "Амбиции и материальное благополучие" :
               "Гуманизм и мудрость"}
            </p>
          </div>
        </div>
        
        {/* Personality Number */}
        <div className={cn(
          "flex items-center mb-4 transition-all duration-500 delay-500",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        )}>
          <div className="bg-cosmic-indigo/20 rounded-lg p-2 mr-3">
            <span className="text-2xl text-cosmic-indigo">{personalityNumber}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-cosmic-indigo">
              {personalityText}
            </h3>
            <p className="text-xs text-cosmic-secondary">
              {personalityNumber === 1 ? "Уверенность в себе" : 
               personalityNumber === 2 ? "Чувствительность и интуиция" :
               personalityNumber === 3 ? "Оптимизм и общительность" :
               personalityNumber === 4 ? "Серьезность и надежность" :
               personalityNumber === 5 ? "Адаптивность и любознательность" :
               personalityNumber === 6 ? "Заботливость и ответственность" :
               personalityNumber === 7 ? "Интроспекция и проницательность" :
               personalityNumber === 8 ? "Авторитетность и решительность" :
               "Идеализм и сострадание"}
            </p>
          </div>
        </div>
        
        <div className={cn(
          "mt-4 text-center transition-all duration-500 delay-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-sm text-cosmic-secondary mt-2">{description}</p>
        </div>
        
        <div className={cn(
          "mt-4 flex justify-center transition-all duration-500 delay-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <button 
            onClick={handleMoreDetails} 
            className="flex items-center justify-center px-4 py-2 mt-2 bg-black border border-cosmic-gold/40 rounded-lg transition-all duration-300 hover:bg-black/50 text-xs"
          >
            <Star className="mr-2 w-4 h-4 text-cosmic-gold" />
            <span className="text-cosmic-gold">{moreDetailsText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
