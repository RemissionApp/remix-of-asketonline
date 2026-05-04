import React from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { ZodiacSign } from '@/utils/zodiac';
import { useAppStore } from '@/store/useAppStore';

interface DailyHoroscopeCardProps {
  zodiacSign: ZodiacSign;
  horoscope: { description: string } | null;
  loading: boolean;
  onGenerate: () => void;
  uiText: any;
}

export const DailyHoroscopeCard: React.FC<DailyHoroscopeCardProps> = ({
  horoscope,
  loading,
  onGenerate,
  uiText,
}) => {
  const { language } = useAppStore();
  const today = new Date();
  const locale = language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US';
  const todayFormatted = today.toLocaleDateString(locale, { day: 'numeric', month: 'long' });

  return (
    <button
      onClick={onGenerate}
      disabled={loading}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-cosmic-gold/25 bg-gradient-to-br from-cosmic-gold/25 via-cosmic-dark/60 to-cosmic-gold/10 p-4 text-left shadow-lg shadow-cosmic-gold/25 transition-transform active:scale-[0.99] disabled:active:scale-100"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-gold/60 shadow-[0_0_24px_rgba(232,193,108,0.55)]">
          {loading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Calendar className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-center">
          <div className={`text-base font-semibold text-white ${language === 'en' ? 'font-serif' : ''}`}>
            {uiText.dailyTitle}
          </div>
          <div className="mt-0.5 text-[11px] text-cosmic-secondary">{todayFormatted}</div>
        </div>
      </div>

      {horoscope && (
        <p className="mt-3 text-xs leading-relaxed text-white/90 text-justify">
          {horoscope.description}
        </p>
      )}
    </button>
  );
};
