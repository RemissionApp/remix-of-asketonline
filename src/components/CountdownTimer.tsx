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

interface CountdownTimerProps {
  pactId?: string; // Optional pact ID to specify which pact to count down for
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ pactId }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ 
    days: 0,
    hours: 0, 
    minutes: 0, 
    seconds: 0,
    milliseconds: 0
  });
  const { language, pacts } = useAppStore();

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

  // Calculate time until pact ends
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Find the current active pact
      let activePact = null;
      
      if (pactId) {
        // If a pact ID is provided, find that specific pact
        activePact = pacts?.find(p => p.id === pactId && p.status === 'active');
      } else if (pacts && pacts.length > 0) {
        // Otherwise, just get the first active pact
        activePact = pacts.find(p => p.status === 'active');
      }

      if (!activePact) {
        // If no active pact is found, set all values to 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        return;
      }

      // Find the first incomplete day for this pact
      const incompleteDays = activePact.days.filter(day => !day.completed);
      
      if (incompleteDays.length === 0) {
        // If all days are completed, set all values to 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        return;
      }
      
      // Get the end date of the pact based on incomplete days
      const now = new Date();
      const endDate = new Date(activePact.createdAt);
      endDate.setDate(endDate.getDate() + activePact.duration);
      
      const difference = endDate.getTime() - now.getTime();
      
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
    const timer = setInterval(calculateTimeLeft, 10); // Update frequently for milliseconds
    
    return () => clearInterval(timer);
  }, [pactId, pacts]);
  
  // Get countdown text
  const getCountdownText = () => {
    switch (language) {
      case 'ru': return 'До завершения аскезы';
      case 'es': return 'Hasta el fin de la ascesis';
      default: return 'Until ascesis ends';
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 bg-cosmic-dark/60 backdrop-blur-sm py-1 px-2 z-20">
      <div className="flex items-center justify-center text-xs">
        <span className="text-cosmic-secondary mr-2">{getCountdownText()}:</span>
        <div className="flex items-center space-x-2">
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
    </div>
  );
};
