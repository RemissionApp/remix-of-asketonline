import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const UserGreetingSection: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format the current date based on language
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    return currentDateTime.toLocaleDateString(
      language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US',
      options
    );
  };

  // Определяем имя для приветствия
  const userName =
    userProfile?.name ||
    (language === 'ru'
      ? 'Искатель'
      : language === 'es'
        ? 'Buscador'
        : 'Seeker');

  return (
    <div className="mb-6 text-center p-4 relative z-10">
      <h2
        className={
          language === 'en'
            ? 'font-serif text-xl font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
            : 'font-sans text-xl font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
        }
      >
        {language === 'ru'
          ? 'Приветствую тебя!'
          : language === 'es'
            ? '¡Te saludo!'
            : 'Greetings!'}
      </h2>
      <h3
        className={
          language === 'en'
            ? 'font-serif text-lg mt-2 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
            : 'font-sans text-lg mt-2 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
        }
      >
        {userName}
      </h3>
      <div className="flex items-center justify-center mt-3 text-slate-300 text-sm font-medium">
        <Clock size={14} className="mr-1" />
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          {getFormattedDate()}
        </span>
      </div>
    </div>
  );
};
