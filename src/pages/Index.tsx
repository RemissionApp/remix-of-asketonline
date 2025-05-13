
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { UserAvatar } from '@/components/UserAvatar';

const Index = () => {
  const { t } = useTranslations();
  const { userProfile } = useAppStore();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cosmic">
      <div className="text-center text-white">
        <div className="flex flex-col items-center mb-6">
          <UserAvatar size="lg" showRankBorder={true} />
          <h2 className="mt-3 text-lg text-cosmic-accent">{userProfile.name}</h2>
        </div>
        <h1 className="text-4xl font-serif mb-4 cosmic-gradient-text">{t.welcome.title}</h1>
        <p className="text-xl text-cosmic-secondary">{t.welcome.subtitle}</p>
      </div>
    </div>
  );
};

export default Index;
