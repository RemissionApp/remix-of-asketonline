
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ 
    days: 0,
    hours: 0, 
    minutes: 0, 
    seconds: 0,
    milliseconds: 0
  });
  const { language } = useAppStore();

  // Get translations for time units
  const getDaysLabel = () => {
    switch (language) {
      case 'ru': return 'д';
      case 'es': return 'd';
      default: return 'd';
    }
  };
  
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
  
  const getMillisecondsLabel = () => {
    switch (language) {
      case 'ru': return 'мс';
      case 'es': return 'ms';
      default: return 'ms';
    }
  };

  // Calculate time until end of day
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const difference = endOfDay.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        const milliseconds = Math.floor((difference % 1000) / 10); // Get only tens of milliseconds (2 digits)
        
        setTimeLeft({ days, hours, minutes, seconds, milliseconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 10); // Update more frequently for milliseconds
    
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
    <div className="fixed top-16 left-0 right-0 bg-cosmic-dark/60 backdrop-blur-sm py-1 px-2 z-20">
      <div className="flex items-center justify-center space-x-2 text-xs">
        <div className="flex flex-col items-center">
          <span className="text-cosmic-accent font-medium">{timeLeft.days.toString().padStart(2, '0')}</span>
          <span className="text-cosmic-secondary text-[10px]">{getDaysLabel()}</span>
        </div>
        <span className="text-cosmic-accent">:</span>
        <div className="flex flex-col items-center">
          <span className="text-cosmic-accent font-medium">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-cosmic-secondary text-[10px]">{getHoursLabel()}</span>
        </div>
        <span className="text-cosmic-accent">:</span>
        <div className="flex flex-col items-center">
          <span className="text-cosmic-accent font-medium">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-cosmic-secondary text-[10px]">{getMinutesLabel()}</span>
        </div>
        <span className="text-cosmic-accent">:</span>
        <div className="flex flex-col items-center">
          <span className="text-cosmic-accent font-medium">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="text-cosmic-secondary text-[10px]">{getSecondsLabel()}</span>
        </div>
        <span className="text-cosmic-accent">:</span>
        <div className="flex flex-col items-center">
          <span className="text-cosmic-accent font-medium">{timeLeft.milliseconds.toString().padStart(2, '0')}</span>
          <span className="text-cosmic-secondary text-[10px]">{getMillisecondsLabel()}</span>
        </div>
      </div>
    </div>
  );
};
