import React from 'react';
import { Star } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { ZodiacSignDisplay } from '@/components/ZodiacSignDisplay';

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
  userName,
}) => {
  return (
    <>
      <CardTitle className="flex items-center gap-2 text-cosmic-gold">
        <Star className="text-cosmic-gold" size={24} />
        {language === 'ru'
          ? 'Гороскоп'
          : language === 'es'
            ? 'Horóscopo'
            : 'Horoscope'}
      </CardTitle>
      <CardDescription className="text-cosmic-secondary text-base">
        {zodiacInfo && (
          <ZodiacSignDisplay
            zodiacSign={zodiacInfo.sign}
            language={language}
            className="inline-flex"
            textClassName="text-cosmic-secondary"
          />
        )}
      </CardDescription>
      {/* User Greeting */}
      <h2
        className={`text-cosmic-gold ${language === 'en' ? 'font-serif' : 'font-sans'} text-xl mt-3`}
      >
        {language === 'ru'
          ? `Приветствую тебя, ${userName || 'Искатель'}!`
          : language === 'es'
            ? `¡Te saludo, ${userName || 'Buscador'}!`
            : `Greetings, ${userName || 'Seeker'}!`}
      </h2>
    </>
  );
};
