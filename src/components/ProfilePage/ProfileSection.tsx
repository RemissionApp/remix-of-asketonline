
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { LanguageSelector } from './LanguageSelector';
import { SubscriptionManager } from './SubscriptionManager';
import { LegalDocuments } from './LegalDocuments';
import { LogoutButton } from './LogoutButton';
import UserProfileForm from '@/components/UserProfileForm';

export const ProfileSection: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="mb-6 w-full">
      <h1 className="text-2xl text-white font-serif mb-4">
        {t.main?.profile || "Профиль"}
      </h1>
      
      <UserProfileForm />
      
      <div className="mt-8">
        <h2 className="text-xl text-white font-serif mb-4">{t.userProfile?.languageLabel || "App language"}</h2>
        <LanguageSelector />
        
        <h2 className="text-xl text-white font-serif mb-4">Подписка</h2>
        <SubscriptionManager />
        
        <LegalDocuments />
        <LogoutButton />
      </div>
    </div>
  );
};
