
import React from 'react';
import { DetailedHoroscope } from '@/types/horoscope';

interface HoroscopeStatsProps {
  horoscope: DetailedHoroscope;
  translations: any;
  language: string;
}

export const HoroscopeStats: React.FC<HoroscopeStatsProps> = ({
  horoscope,
  translations,
  language
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm mt-6 text-cosmic-accent">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {translations.luckyNumber[language] || translations.luckyNumber.en}:
        </span>
        <span>{horoscope.lucky_number}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {translations.luckyTime[language] || translations.luckyTime.en}:
        </span>
        <span>{horoscope.lucky_time}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {translations.color[language] || translations.color.en}:
        </span>
        <span>{horoscope.color}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {translations.mood[language] || translations.mood.en}:
        </span>
        <span>{horoscope.mood}</span>
      </div>
    </div>
  );
};
