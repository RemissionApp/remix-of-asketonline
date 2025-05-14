
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const { language } = useAppStore();

  // Get translations for time units
  const getHoursLabel = () => {
    switch (language) {
      case 'ru': return 'ч';
      case 'es': return 'h';
      default: return 'h';
    }
  };
  
  const getMinutesLabel = () => {
    switch (language) {
      case 'ru': return 'м';
      case 'es': return 'm';
      default: return 'm';
    }
  };
  
  const getSecondsLabel = () => {
    switch (language) {
      case 'ru': return 'с';
      case 'es': return 's';
      default: return 's';
    }
  };

  // Get end of day time
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const difference = endOfDay.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get countdown text
  const getCountdownText = () => {
    switch (language) {
      case 'ru': return 'До конца дня';
      case 'es': return 'Hasta el final del día';
      default: return 'Until end of day';
    }
  };

  return (
    <div className="mt-6 mb-6 flex flex-col items-center">
      <div className="text-sm text-cosmic-secondary mb-1 flex items-center">
        <Clock size={16} className="mr-2 text-cosmic-accent" />
        {getCountdownText()}
      </div>
      <div className="flex items-center space-x-2 bg-cosmic-dark/80 backdrop-blur-md rounded-lg px-4 py-2 border border-cosmic-accent/20">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-cosmic-accent">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-xs text-cosmic-secondary">{getHoursLabel()}</span>
        </div>
        <span className="text-xl font-bold text-cosmic-accent">:</span>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-cosmic-accent">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-xs text-cosmic-secondary">{getMinutesLabel()}</span>
        </div>
        <span className="text-xl font-bold text-cosmic-accent">:</span>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-cosmic-accent">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="text-xs text-cosmic-secondary">{getSecondsLabel()}</span>
        </div>
      </div>
    </div>
  );
};
