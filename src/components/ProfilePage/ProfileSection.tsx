
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { LanguageSelector } from './LanguageSelector';
import { SubscriptionManager } from './SubscriptionManager';
import { LegalDocuments } from './LegalDocuments';
import { LogoutButton } from './LogoutButton';
import UserProfileForm from '@/components/UserProfileForm';
import { DeveloperSwitch } from '@/components/DeveloperSwitch';
import { SupportSection } from './SupportSection';

export const ProfileSection: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="w-full">
      <h1 className="text-3xl text-white font-serif mb-6">
        {t.main?.profile || "Profile"}
      </h1>
      
      <UserProfileForm />
      
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl text-white font-serif mb-4">{t.userProfile?.languageLabel || "Application Language"}</h2>
        <LanguageSelector />
        
        <h2 className="text-2xl text-white font-serif mb-4">{t.subscription?.title || "Subscription"}</h2>
        <SubscriptionManager />
        
        {/* Add Developer Switch here to replace the one from MainPage */}
        <h2 className="text-2xl text-white font-serif mb-4">Developer Mode</h2>
        <DeveloperSwitch />
        
        {/* Блок службы поддержки */}
        <h2 className="text-2xl text-white font-serif mb-4">Поддержка</h2>
        <SupportSection />
        
        <LegalDocuments />
        <LogoutButton />
      </div>
    </div>
  );
};
