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

  // Memoize username
  const userName = useMemo(() => {
    return userProfile?.name ||
           (language === 'ru' ? 'Искатель' : 
            language === 'es' ? 'Buscador' : 'Seeker');
  }, [userProfile?.name, language]);

  // Memoize font class based on language
  const fontClass = useMemo(() => {
    return language === 'en' ? 'font-serif' : 'font-sans';
  }, [language]);

  return (
    <div className="mb-6 text-center p-4 relative z-10">
      <h2 className={`${fontClass} text-xl font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}>
        {greeting}
      </h2>
      <h3 className={`${fontClass} text-lg mt-2 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}>
        {userName}
      </h3>
      <div className="flex items-center justify-center mt-3 text-slate-300 text-sm font-medium">
        <Clock size={14} className="mr-1" />
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

// Export memoized component
export const UserGreetingSection = React.memo(MemoizedUserGreetingSection);
