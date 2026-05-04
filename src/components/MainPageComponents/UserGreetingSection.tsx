import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const MemoizedUserGreetingSection: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  // Update only every 5 seconds instead of every second for better performance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Memoize formatting options
  const formatOptions = useMemo((): Intl.DateTimeFormatOptions => ({
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }), []);

  // Memoize locale
  const locale = useMemo(() => {
    return language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US';
  }, [language]);

  // Memoize formatted date (but still update when time changes)
  const formattedDate = useMemo(() => {
    return currentDateTime.toLocaleDateString(locale, formatOptions);
  }, [currentDateTime, locale, formatOptions]);

  // Memoize greeting text based on language
  const greeting = useMemo(() => {
    return language === 'ru' ? 'Приветствую тебя!' : 
           language === 'es' ? '¡Te saludo!' : 'Greetings!';
  }, [language]);

  // Memoize username — show only the user's real name; never substitute
  // a placeholder like "Искатель", which gives the false impression that
  // saved data was lost.
  const userName = useMemo(() => {
    return userProfile?.name?.trim() || '';
  }, [userProfile?.name]);

  // Memoize font class based on language
  const fontClass = useMemo(() => {
    return language === 'en' ? 'font-serif' : 'font-display';
  }, [language]);

  return (
    <div className="mb-1 sm:mb-2 text-center px-3 sm:px-4 pt-1 sm:pt-2 pb-1 relative z-10">
      <p className={`${fontClass} text-xs sm:text-sm uppercase tracking-widest text-cosmic-secondary/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}>
        {greeting}
      </p>
      {userName && (
        <h2 className={`${fontClass} text-2xl sm:text-4xl mt-0.5 font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]`}>
          {userName}
        </h2>
      )}
      <div className="flex items-center justify-center mt-1 text-cosmic-secondary/70 text-[10px] sm:text-xs font-medium">
        <Clock size={12} className="mr-1.5" />
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

// Export memoized component
export const UserGreetingSection = React.memo(MemoizedUserGreetingSection);
