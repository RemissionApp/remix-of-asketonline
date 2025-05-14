
import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface QuoteDisplayProps {
  quote: string;
  className?: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, className }) => {
  const [currentDate, setCurrentDate] = useState<string>("");
  const { userProfile, language } = useAppStore();
  
  // Format current date based on user language
  useEffect(() => {
    const now = new Date();
    let formattedDate = "";
    
    try {
      switch (language) {
        case 'ru':
          formattedDate = now.toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
          break;
        case 'es':
          formattedDate = now.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
          break;
        default:
          formattedDate = now.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
      }
    } catch (e) {
      // Fallback formatting if localization fails
      formattedDate = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    }
    
    setCurrentDate(formattedDate);
  }, [language]);
  
  const userName = userProfile?.name || 'Искатель';
  const greeting = language === 'ru' ? 'Приветствую тебя' : 
                  language === 'es' ? '¡Te saludo' : 
                  'Greetings';
  
  // Date prefix based on language
  const datePrefix = language === 'ru' ? 'Сегодня' : 
                    language === 'es' ? 'Hoy es' : 
                    'Today is';
  
  return (
    <div className={`text-center p-6 max-w-lg mx-auto ${className}`}>
      <div className="mb-4">
        <p className="text-cosmic-gold text-lg font-serif">
          {greeting}, {userName}!
        </p>
        <p className="text-cosmic-accent text-sm mt-1">
          {datePrefix} {currentDate}
        </p>
      </div>
      <p className="cosmic-gradient-text text-xl italic font-serif leading-relaxed">
        {quote}
      </p>
    </div>
  );
};
