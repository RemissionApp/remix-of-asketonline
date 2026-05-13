import React from 'react';
import { Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useCallMinutes } from '@/hooks/useCallMinutes';

export const CallHero: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const { t } = useTranslations();
  const { minutesLeft } = useCallMinutes();

  const lyra = (t as any).lyra || {};
  const title =
    lyra.callButton ||
    (language === 'ru' ? 'Позвонить Лире' : language === 'es' ? 'Llamar a Lyra' : 'Call Lyra');
  const subtitle =
    lyra.callSubtitle ||
    (language === 'ru' ? 'Лира всегда рядом и готова слушать' : language === 'es' ? 'Lyra siempre te escucha' : 'Lyra is always here for you');
  const minutes = (lyra.minutesLeft || 'Minutes left: {{count}}').replace('{{count}}', String(minutesLeft));

  return (
    <button
      onClick={() => navigate('/universe-call')}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-indigo/40 via-cosmic-dark/60 to-cosmic-accent/30 p-5 text-left shadow-lg shadow-cosmic-accent/20 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-indigo shadow-[0_0_30px_rgba(139,92,246,0.6)]">
          <span className="absolute inset-0 rounded-full bg-cosmic-accent/40 animate-ping" />
          <Phone className="relative h-7 w-7 text-white" />
        </div>
        <div className="flex-1 text-center">
          <div className={`text-base font-semibold text-white ${language === 'en' ? 'font-serif' : ''}`}>{title}</div>
          <div className="mt-0.5 text-xs text-cosmic-secondary">{subtitle}</div>
          <div className="mt-1 text-[11px] text-white/60">{minutes}</div>
        </div>
      </div>
    </button>
  );
};