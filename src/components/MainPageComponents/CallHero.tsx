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
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-fuchsia-300/20 bg-gradient-to-br from-violet-900/50 via-cosmic-dark/70 to-fuchsia-900/40 p-5 text-left shadow-[0_0_40px_rgba(139,92,246,0.35)] backdrop-blur-xl transition-transform active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.25),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.18),transparent_60%)]" />
      <div className="relative flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 shadow-[0_0_30px_rgba(168,85,247,0.7),0_0_70px_rgba(139,92,246,0.4)] border border-fuchsia-300/40">
          <span className="absolute inset-0 rounded-full bg-fuchsia-400/30 animate-ping" />
          <span className="absolute -inset-2 rounded-full border border-violet-300/30 animate-ping [animation-duration:2.6s]" />
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