
import React from 'react';
import { useAppStore } from '@/store/useAppStore';

export const NoMissions: React.FC = () => {
  const { language } = useAppStore();
  
  const getMessage = () => {
    return language === 'ru' ? 'Нет доступных миссий' : 
           language === 'es' ? 'No hay misiones disponibles' : 
           'No missions available';
  };
  
  return (
    <div className="text-center py-10 text-cosmic-secondary">
      {getMessage()}
    </div>
  );
};
