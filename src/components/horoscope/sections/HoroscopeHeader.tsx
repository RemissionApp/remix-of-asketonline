
import React from 'react';
import { Star } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface HoroscopeHeaderProps {
  zodiacInfo: any;
  translations: any;
  language: string;
  userName?: string;
}

export const HoroscopeHeader: React.FC<HoroscopeHeaderProps> = ({
  zodiacInfo,
  translations,
  language,
  userName
}) => {
  return (
    <>
      <CardTitle className="flex items-center gap-2">
        <Star className="text-cosmic-gold" size={20} />
        {translations.title[language] || translations.title.en}
      </CardTitle>
      <CardDescription>
        {zodiacInfo?.symbol} {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
      </CardDescription>
      {/* User Greeting */}
      <h2 className="text-cosmic-gold font-serif text-lg mt-2">
        {language === 'ru' 
          ? `Приветствую тебя, ${userName || 'Искатель'}!` 
          : language === 'es'
            ? `¡Te saludo, ${userName || 'Buscador'}!`
            : `Greetings, ${userName || 'Seeker'}!`}
      </h2>
    </>
  );
};
