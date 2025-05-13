
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

const Index = () => {
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic">
      <div className="text-center text-white">
        <h1 className="text-4xl font-serif mb-4 cosmic-gradient-text">{t.welcome.title}</h1>
        <p className="text-xl text-cosmic-secondary">{t.welcome.subtitle}</p>
      </div>
    </div>
  );
};

export default Index;
