
import React from 'react';
import { EnergyCircle } from './EnergyCircle';
import { Pact } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';

interface PactCardProps {
  pact: Pact;
  onClick?: () => void;
}

export const PactCard: React.FC<PactCardProps> = ({ pact, onClick }) => {
  const daysCompleted = pact.days.filter(day => day.completed).length;
  const progress = Math.round((daysCompleted / pact.duration) * 100);
  const { language } = useAppStore();
  const { t } = useTranslations();
  
  // Функция для правильного склонения в русском языке
  const getDaysText = (count: number): string => {
    if (language !== 'ru') {
      return t.main.days;
    }
    
    // Правило для русского языка
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return 'день';
    } else if (
      (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) && 
      !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
    ) {
      return 'дня';
    } else {
      return 'дней';
    }
  };
  
  return (
    <div 
      className="cosmic-card flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
      onClick={onClick}
    >
      <EnergyCircle progress={progress} size="sm">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{daysCompleted}/{pact.duration}</p>
          <p className="text-sm text-cosmic-accent">{getDaysText(daysCompleted)}</p>
        </div>
      </EnergyCircle>
      
      <h3 className="mt-4 text-xl font-serif text-white">{pact.title}</h3>
      
      <p className="mt-2 text-sm text-cosmic-secondary opacity-70">
        {pact.status === 'active' ? 'Активная аскеза' : 
         pact.status === 'completed' ? 'Завершена' : 'Прервана'}
      </p>
    </div>
  );
};

