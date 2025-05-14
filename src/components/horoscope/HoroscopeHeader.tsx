
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { zodiacData } from '@/utils/zodiac';

interface HoroscopeHeaderProps {
  userName: string;
  currentDate: string;
  zodiacSign: string | null;
  isPro: boolean;
  refreshing: boolean;
  handleRefresh: () => void;
  language: string;
}

export const HoroscopeHeader: React.FC<HoroscopeHeaderProps> = ({
  userName,
  currentDate,
  zodiacSign,
  isPro,
  refreshing,
  handleRefresh,
  language
}) => {
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl text-cosmic-gold font-serif mb-1">
          {userName}, это твой день!
        </h2>
        <p className="text-cosmic-accent text-sm">
          {currentDate}
        </p>
        
        {/* Developer mode refresh button */}
        {isPro && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-cosmic-accent border-cosmic-accent/30 hover:bg-cosmic-accent/10"
            >
              <RefreshCw size={14} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 
                (language === 'ru' ? 'Обновление...' : 
                 language === 'es' ? 'Actualizando...' : 
                 'Refreshing...') : 
                (language === 'ru' ? 'Обновить гороскоп' : 
                 language === 'es' ? 'Actualizar horóscopo' : 
                 'Refresh horoscope')}
            </Button>
          </div>
        )}
      </div>
      
      {/* Zodiac sign display */}
      {zodiacInfo && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-cosmic-accent/10 px-4 py-2 rounded-full">
            <span className="text-2xl">{zodiacInfo.symbol}</span>
            <span className="text-white">{zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en}</span>
          </div>
        </div>
      )}
    </>
  );
};
