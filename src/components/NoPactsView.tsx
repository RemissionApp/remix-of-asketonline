import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';

interface NoPactsViewProps {
  onCreatePactClick?: () => void;
}

export const NoPactsView: React.FC<NoPactsViewProps> = ({
  onCreatePactClick,
}) => {
  const { language, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const handleCreatePact = () => {
    // Use the provided handler if it exists
    if (onCreatePactClick) {
      onCreatePactClick();
      return;
    }

    // Otherwise handle navigation directly from this component
    setActiveScreen('create-pact');
    navigate('/create-pact');
  };

  const ctaLabel =
    language === 'ru' ? 'Заключить договор' : language === 'es' ? 'Hacer un pacto' : 'Make a covenant';

  return (
    <div className="w-full max-w-lg mx-auto text-center flex flex-col items-center gap-4">
      <h1 className="text-2xl font-serif text-white">{t.main.noPacts}</h1>
      <button
        onClick={handleCreatePact}
        className="w-full glass-medium glass-shine relative rounded-2xl py-4 text-base font-semibold text-white border border-cosmic-gold/25 active:scale-[0.98] transition-all duration-150 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-cosmic-gold/10 via-transparent to-cosmic-gold/10 pointer-events-none" />
        <span className="relative z-10">{ctaLabel}</span>
      </button>
    </div>
  );
};
