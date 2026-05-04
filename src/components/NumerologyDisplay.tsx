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
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-cosmic-gold/25 bg-gradient-to-br from-cosmic-gold/25 via-cosmic-dark/60 to-cosmic-gold/10 p-5 text-left shadow-lg shadow-cosmic-gold/30 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-gold/60 shadow-[0_0_30px_rgba(232,193,108,0.55)]">
          <Calculator size={26} className="text-white" />
        </div>
        <div className="flex-1 min-w-0 text-center">
          <div className={`text-base font-semibold text-white ${language === 'en' ? 'font-serif' : ''}`}>{numerologyText}</div>
          <div className="mt-0.5 text-xs text-cosmic-secondary">{description}</div>
        </div>
      </div>
    </button>
  );
};
