
import React from 'react';
import { EnergyCircle } from './EnergyCircle';
import { Pact } from '@/types';

interface PactCardProps {
  pact: Pact;
  onClick?: () => void;
}

export const PactCard: React.FC<PactCardProps> = ({ pact, onClick }) => {
  const daysCompleted = pact.days.filter(day => day.completed).length;
  const progress = Math.round((daysCompleted / pact.duration) * 100);
  
  return (
    <div 
      className="cosmic-card flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
      onClick={onClick}
    >
      <EnergyCircle progress={progress} size="sm">
        <div className="text-center">
          <p className="text-lg font-bold text-white">{daysCompleted}/{pact.duration}</p>
          <p className="text-sm text-cosmic-accent">дней</p>
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
