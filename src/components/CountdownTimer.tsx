import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useDebouncedValue } from '@/utils/reactOptimizations';

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

const MemoizedCountdownTimer: React.FC<CountdownTimerProps> = ({ pactId }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const { language, pacts } = useAppStore();
  const { t } = useTranslations();
  
  // Debounce milliseconds for better performance
  const debouncedMilliseconds = useDebouncedValue(timeLeft.milliseconds, 50);

  // Memoize label functions to prevent recreating on each render
  const timeLabels = useMemo(() => ({
    days: language === 'ru' ? 'д' : 'd',
    hours: language === 'ru' ? 'ч' : 'h', 
    minutes: language === 'ru' ? 'м' : 'm',
    seconds: language === 'ru' ? 'с' : 's',
    milliseconds: language === 'ru' ? 'мс' : 'ms'
  }), [language]);

  // Memoize active pact lookup
  const activePact = useMemo(() => {
    if (!pacts?.length) return null;
    
    if (pactId) {
      return pacts.find(p => p.id === pactId) || null;
    }
    
    return pacts.find(p => p.status === 'active') || null;
  }, [pacts, pactId]);

  // Stable callback for time calculation
  const calculateTimeLeft = useCallback(() => {
    if (!activePact) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      return;
    }

    const now = new Date();
    const createdAtDate = new Date(activePact.created_at);
    
    // Use more robust date calculation instead of setDate()
    const endDate = new Date(createdAtDate.getTime() + (activePact.duration * 24 * 60 * 60 * 1000));
    
    // Debug logging
    console.log('CountdownTimer Debug:', {
      activePact: activePact.title,
      createdAt: createdAtDate.toISOString(),
      duration: activePact.duration,
      endDate: endDate.toISOString(),
      now: now.toISOString()
    });

    const difference = endDate.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const milliseconds = Math.floor((difference % 1000) / 10);

      setTimeLeft({ days, hours, minutes, seconds, milliseconds });
    } else {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    }
  }, [activePact]);

  // Calculate time until pact ends
  useEffect(() => {
    calculateTimeLeft();
    // Reduce update frequency - every 100ms instead of 10ms for better performance
    const timer = setInterval(calculateTimeLeft, 100);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="w-full bg-cosmic-dark/60 backdrop-blur-sm py-1 px-2">
      <div className="flex items-center justify-center text-xs">
        <Clock size={16} className="text-cosmic-secondary mr-1" />
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium">
              {timeLeft.days.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.days}
            </span>
          </div>
          <span className="text-cosmic-accent">:</span>
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.hours}
            </span>
          </div>
          <span className="text-cosmic-accent">:</span>
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.minutes}
            </span>
          </div>
          <span className="text-cosmic-accent">:</span>
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.seconds}
            </span>
          </div>
          <span className="text-cosmic-accent">:</span>
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium">
              {debouncedMilliseconds.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.milliseconds}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export memoized component
export const CountdownTimer = React.memo(MemoizedCountdownTimer);
