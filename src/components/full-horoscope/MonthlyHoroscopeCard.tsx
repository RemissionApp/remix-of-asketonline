import React from 'react';
import { CalendarDays, Loader2, Heart, Briefcase, Leaf, Star } from 'lucide-react';
import { ZodiacSign } from '@/utils/zodiac';
import { useAppStore } from '@/store/useAppStore';

interface MonthlyHoroscopeData {
  generalForecast: string;
  careerFinance: string;
  loveRelationships: string;
  healthWellbeing: string;
  fullText: string;
}

interface MonthlyHoroscopeCardProps {
  zodiacSign: ZodiacSign;
  horoscope: MonthlyHoroscopeData | null;
  loading: boolean;
  onGenerate: () => void;
  uiText: any;
}

export const MonthlyHoroscopeCard: React.FC<MonthlyHoroscopeCardProps> = ({
  horoscope,
  loading,
  onGenerate,
  uiText,
}) => {
  const { language } = useAppStore();
  const locale = language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US';
  const currentMonth = new Date().toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  const sections = horoscope
    ? [
        { title: uiText.generalForecast, content: horoscope.generalForecast, icon: Star },
        { title: uiText.careerFinance, content: horoscope.careerFinance, icon: Briefcase },
        { title: uiText.loveRelationships, content: horoscope.loveRelationships, icon: Heart },
        { title: uiText.healthWellbeing, content: horoscope.healthWellbeing, icon: Leaf },
      ]
    : [];

  return (
    <button
      onClick={onGenerate}
      disabled={loading}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-cosmic-deep-blue/30 bg-gradient-to-br from-cosmic-deep-blue/40 via-cosmic-dark/60 to-cosmic-deep-blue/15 p-4 text-left shadow-lg shadow-cosmic-deep-blue/35 transition-transform active:scale-[0.99] disabled:active:scale-100"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-deep-blue to-cosmic-indigo/70 shadow-[0_0_24px_rgba(56,189,248,0.5)]">
          {loading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <CalendarDays className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-center">
          <div className={`text-base font-semibold text-white ${language === 'en' ? 'font-serif' : ''}`}>
            {uiText.monthlyTitle}
          </div>
          <div className="mt-0.5 text-[11px] text-cosmic-secondary">{currentMonth}</div>
        </div>
      </div>

      {horoscope && (
        <div className="mt-3 space-y-2">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5 text-cosmic-deep-blue" />
                  <h4 className="text-xs font-medium text-white">{s.title}</h4>
                </div>
                <p className="text-[11px] text-white/85 leading-relaxed text-justify">{s.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </button>
  );
};
