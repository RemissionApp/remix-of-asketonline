
import React from 'react';
import { DetailedHoroscope } from '@/types/horoscope';
import { Star, Clock, Palette, Smile } from 'lucide-react';

interface HoroscopeStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const HoroscopeStat: React.FC<HoroscopeStatProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-1.5 justify-between">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-cosmic-accent">{label}:</span>
      </div>
      <span className="font-medium cosmic-gradient-text">{value}</span>
    </div>
  );
};

interface HoroscopeStatsProps {
  horoscope: DetailedHoroscope | null;
  translations: any;
  language: string;
}

export const HoroscopeStats: React.FC<HoroscopeStatsProps> = ({
  horoscope,
  translations,
  language
}) => {
  // Safety check - if no horoscope data is available, return null
  if (!horoscope) {
    return null;
  }

  // Some horoscopes might not have these properties, provide fallbacks
  const luckyNumber = horoscope.lucky_number || '7';
  const luckyTime = horoscope.lucky_time || '12:00 PM';
  const color = horoscope.color || 'blue';
  const mood = horoscope.mood || 'peaceful';

  return (
    <div className="cosmic-section p-3 border border-cosmic-accent/20 rounded-lg bg-cosmic-dark/30">
      <h3 className="text-cosmic-accent font-medium mb-2">
        {translations.luckyNumber.label?.[language] || translations.luckyNumber.label?.en || 'Cosmic Insights'}
      </h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <HoroscopeStat
          icon={<Star className="text-cosmic-gold" size={16} />}
          label={translations.luckyNumber[language] || translations.luckyNumber.en}
          value={luckyNumber}
        />
        <HoroscopeStat
          icon={<Clock className="text-cosmic-silver" size={16} />}
          label={translations.luckyTime[language] || translations.luckyTime.en}
          value={luckyTime}
        />
        <HoroscopeStat
          icon={<Palette className="text-cosmic-secondary" size={16} />}
          label={translations.color[language] || translations.color.en}
          value={color}
        />
        <HoroscopeStat
          icon={<Smile className="text-cosmic-purple" size={16} />}
          label={translations.mood[language] || translations.mood.en}
          value={mood}
        />
      </div>
    </div>
  );
};
