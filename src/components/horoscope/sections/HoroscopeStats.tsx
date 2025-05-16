
import React from 'react';
import { DetailedHoroscope } from '@/types/horoscope';

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
  if (!horoscope) {
    return null;
  }

  const statsConfig = [
    {
      key: 'lucky_number',
      title: translations.luckyNumber[language] || translations.luckyNumber.en,
      value: horoscope.lucky_number,
      icon: '🔢'
    },
    {
      key: 'lucky_time',
      title: translations.luckyTime[language] || translations.luckyTime.en,
      value: horoscope.lucky_time,
      icon: '⏰'
    },
    {
      key: 'color',
      title: translations.color[language] || translations.color.en,
      value: horoscope.color,
      icon: '🎨'
    },
    {
      key: 'mood',
      title: translations.mood[language] || translations.mood.en,
      value: horoscope.mood,
      icon: '😊'
    }
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      {statsConfig.map(stat => (
        <div 
          key={stat.key} 
          className="bg-cosmic-dark/40 border border-cosmic-accent/30 p-3 rounded-lg flex items-center backdrop-blur-sm shadow-md transition-all duration-300 hover:border-cosmic-accent/50"
        >
          <span className="text-xl mr-3">{stat.icon}</span>
          <div>
            <p className="text-xs text-cosmic-secondary">{stat.title}</p>
            <p className="text-cosmic-accent font-medium">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
