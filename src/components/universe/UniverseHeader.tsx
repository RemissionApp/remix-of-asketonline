
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';

export const UniverseHeader: React.FC = () => {
  const { setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    setActiveScreen('main');
    navigate('/main');
  };
  
  return (
    <div className="relative z-10 px-4 py-4 flex items-center">
      <button
        className="p-2 text-cosmic-accent"
        onClick={handleGoBack}
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
        {t.universe.title}
      </h1>
    </div>
  );
};
