import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useDebouncedValue } from '@/utils/reactOptimizations';
import { PACT_DISPLAY_CONSTANTS, TimerFrequency } from './constants';
import { Pact } from '@/types';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

interface UnifiedCountdownTimerProps {
  pact: Pact;
  className?: string;
}

export const UnifiedCountdownTimer: React.FC<UnifiedCountdownTimerProps> = ({ 
  pact, 
  className 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });
  const { language } = useAppStore();
  const { t } = useTranslations();
  
  // Debounce for better performance
  const debouncedSeconds = useDebouncedValue(timeLeft.seconds, PACT_DISPLAY_CONSTANTS.PERFORMANCE.DEBOUNCE_MS);

  // Memoize labels
  const timeLabels = useMemo(() => ({
    days: language === 'ru' ? 'д' : language === 'es' ? 'd' : 'd',
    hours: language === 'ru' ? 'ч' : language === 'es' ? 'h' : 'h', 
    minutes: language === 'ru' ? 'м' : language === 'es' ? 'm' : 'm',
    seconds: language === 'ru' ? 'с' : language === 'es' ? 's' : 's',
  }), [language]);

  // Calculate end date from pact data
  const endDate = useMemo(() => {
    // Use end_date if available, otherwise calculate from start date and duration
    if (pact.end_date) {
      return new Date(pact.end_date);
    }
    
    const startDate = new Date(pact.created_at || pact.start_date);
    const calculatedEndDate = new Date(startDate);
    calculatedEndDate.setDate(startDate.getDate() + pact.duration);
    return calculatedEndDate;
  }, [pact.end_date, pact.created_at, pact.start_date, pact.duration]);

  // Determine optimal update frequency
  const getUpdateFrequency = useCallback((totalMs: number): TimerFrequency => {
    const totalDays = totalMs / (1000 * 60 * 60 * 24);
    
    if (totalDays > 1) return 'HOURS';
    if (totalMs > 60 * 60 * 1000) return 'MINUTES'; // More than 1 hour
    return 'SECONDS';
  }, []);

  // Calculate time remaining
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isCompleted: true,
      });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
  }, [endDate]);

  // Setup timer with dynamic frequency
  useEffect(() => {
    calculateTimeLeft();
    
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();
    
    if (difference <= 0) return;
    
    const frequency = getUpdateFrequency(difference);
    const interval = PACT_DISPLAY_CONSTANTS.TIMER_FREQUENCIES[frequency];
    
    const timer = setInterval(calculateTimeLeft, interval);
    return () => clearInterval(timer);
  }, [calculateTimeLeft, endDate, getUpdateFrequency]);

  // Show completed state
  if (timeLeft.isCompleted) {
    return (
      <div className={cn(
        "w-full bg-cosmic-dark/60 backdrop-blur-sm py-1 px-2",
        className
      )}>
        <div className="flex items-center justify-center text-xs">
          <Clock size={16} className="text-cosmic-accent mr-1" />
          <span className="text-cosmic-accent font-medium">
            {language === 'ru' ? 'Аскеза завершена' : 
             language === 'es' ? 'Ascesis completada' : 
             'Ascesis completed'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full bg-cosmic-dark/60 backdrop-blur-sm py-1 px-2 transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-center text-xs">
        <Clock size={16} className="text-cosmic-secondary mr-1 animate-pulse" />
        <div className="flex items-center space-x-2">
          {/* Days */}
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium tabular-nums">
              {timeLeft.days.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.days}
            </span>
          </div>
          
          <span className="text-cosmic-accent">:</span>
          
          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium tabular-nums">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.hours}
            </span>
          </div>
          
          <span className="text-cosmic-accent">:</span>
          
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="text-cosmic-accent font-medium tabular-nums">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-cosmic-secondary text-[10px]">
              {timeLabels.minutes}
            </span>
          </div>
          
          {/* Only show seconds if less than 1 hour remaining */}
          {timeLeft.days === 0 && timeLeft.hours === 0 && (
            <>
              <span className="text-cosmic-accent">:</span>
              <div className="flex flex-col items-center">
                <span className="text-cosmic-accent font-medium tabular-nums">
                  {debouncedSeconds.toString().padStart(2, '0')}
                </span>
                <span className="text-cosmic-secondary text-[10px]">
                  {timeLabels.seconds}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};