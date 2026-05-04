import React from 'react';
import { Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();

  if (!userProfile?.birthDate) {
    return null;
  }

  const numerologyText =
    language === 'ru' ? 'Нумерология' : language === 'es' ? 'Numerología' : 'Numerology';
  const description =
    language === 'ru'
      ? 'Откройте тайны чисел и их влияние на вашу жизнь'
      : language === 'es'
        ? 'Descubre los secretos de los números y su influencia en tu vida'
        : 'Discover the secrets of numbers and their influence on your life';

  return (
    <button
      onClick={() => navigate('/numerology')}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/20 via-cosmic-dark/60 to-cosmic-indigo/25 p-5 text-left shadow-lg shadow-cosmic-accent/10 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent/80 to-cosmic-indigo/70 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          <Calculator size={26} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-white">{numerologyText}</div>
          <div className="mt-0.5 text-xs text-cosmic-secondary">{description}</div>
        </div>
      </div>
    </button>
  );
};
