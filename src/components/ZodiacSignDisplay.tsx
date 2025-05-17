
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { zodiacData } from '@/utils/zodiac';

interface ZodiacSignDisplayProps {
  zodiacSign: string;
  language: string;
  showElement?: boolean;
  showDates?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  textClassName?: string;
  symbolClassName?: string;
}

export const ZodiacSignDisplay: React.FC<ZodiacSignDisplayProps> = ({
  zodiacSign,
  language,
  showElement = false,
  showDates = false,
  size = 'md',
  className = '',
  textClassName = '',
  symbolClassName = ''
}) => {
  if (!zodiacSign || !zodiacData[zodiacSign]) {
    return null;
  }
  
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  
  // Helper to translate element based on language
  const getTranslatedElement = () => {
    if (!showElement) return null;
    
    const element = zodiacInfo.element;
    let translatedElement = element;
    
    if (language === 'ru') {
      switch (element) {
        case 'Fire': translatedElement = 'Огонь'; break;
        case 'Earth': translatedElement = 'Земля'; break;
        case 'Air': translatedElement = 'Воздух'; break;
        case 'Water': translatedElement = 'Вода'; break;
      }
    } else if (language === 'es') {
      switch (element) {
        case 'Fire': translatedElement = 'Fuego'; break;
        case 'Earth': translatedElement = 'Tierra'; break;
        case 'Air': translatedElement = 'Aire'; break;
        case 'Water': translatedElement = 'Agua'; break;
      }
    }
    
    return translatedElement;
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          symbol: 'text-lg',
          text: 'text-sm'
        };
      case 'lg':
        return {
          symbol: 'text-3xl',
          text: 'text-xl'
        };
      case 'md':
      default:
        return {
          symbol: 'text-2xl',
          text: 'text-base'
        };
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`${sizeClasses.symbol} text-amber-400 ${symbolClassName}`}>
        {zodiacInfo.symbol}
      </span>
      <span className={`${sizeClasses.text} ${textClassName}`}>
        {zodiacName}
        {showElement && getTranslatedElement() && (
          <span className="text-gray-400 ml-1">• {getTranslatedElement()}</span>
        )}
        {showDates && (
          <span className="text-gray-400 ml-1">• {zodiacInfo.dates}</span>
        )}
      </span>
    </div>
  );
};
