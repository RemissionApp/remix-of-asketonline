import React from 'react';
import { Calendar, Loader2, Star, Briefcase, Heart, Shield, Target, Lightbulb } from 'lucide-react';
import { ZodiacSign } from '@/utils/zodiac';
import { translateSection } from '@/utils/zodiacTranslations';

interface YearlyHoroscopeCardProps {
  zodiacSign: ZodiacSign;
  horoscope: any | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
  language: string;
  currentYear: number;
  uiText: any;
}

const getSectionIcon = (key: string) => {
  switch (key) {
    case 'overallForecast': return Star;
    case 'careerFinance': return Briefcase;
    case 'loveRelationships': return Heart;
    case 'healthWellbeing': return Shield;
    case 'spiritualGrowth': return Target;
    case 'personalGrowth': return Lightbulb;
    default: return Star;
  }
};

export const YearlyHoroscopeCard: React.FC<YearlyHoroscopeCardProps> = ({
  horoscope,
  loading,
  error,
  onGenerate,
  language,
  currentYear,
  uiText,
}) => {
  return (
    <button
      onClick={onGenerate}
      disabled={loading}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/25 via-cosmic-dark/60 to-emerald-500/10 p-4 text-left shadow-lg shadow-emerald-500/25 transition-transform active:scale-[0.99] disabled:active:scale-100"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600/70 shadow-[0_0_24px_rgba(52,211,153,0.55)]">
          {loading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Calendar className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-center">
          <div className={`text-base font-semibold text-white ${language === 'en' ? 'font-serif' : ''}`}>
            {uiText.yearlyTitle} {currentYear}
          </div>
          <div className="mt-0.5 text-[11px] text-cosmic-secondary">{uiText.yearlyDescription}</div>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-red-500/15 border border-red-500/30 p-2.5">
          <p className="text-[11px] text-red-200">{error}</p>
        </div>
      )}

      {horoscope && (
        <div className="mt-3 space-y-2">
          {Object.entries(horoscope).map(([key, content]) => {
            const Icon = getSectionIcon(key);
            return (
              <div key={key} className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5 text-emerald-300" />
                  <h4 className="text-xs font-medium text-white">
                    {translateSection(key, language as any)}
                  </h4>
                </div>
                <p className="text-[11px] text-white/85 leading-relaxed whitespace-pre-line text-justify">
                  {content as string}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </button>
  );
};
