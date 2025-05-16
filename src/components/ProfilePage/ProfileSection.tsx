
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { LanguageSelector } from './LanguageSelector';
import { SubscriptionManager } from './SubscriptionManager';
import { LegalDocuments } from './LegalDocuments';
import { LogoutButton } from './LogoutButton';
import UserProfileForm from '@/components/UserProfileForm';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';

export const ProfileSection: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="w-full">
      <h1 className="text-3xl text-white font-serif mb-6">
        {t.main?.profile || "Профиль"}
      </h1>
      
      <UserProfileForm />
      
      {/* Add spacing and zodiac section heading */}
      <div className="mt-12">
        <h2 className="text-2xl text-white font-serif mb-4">{"Знак зодиака"}</h2>
        <ZodiacBadgeDisplay />
      </div>
      
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl text-white font-serif mb-4">{t.userProfile?.languageLabel || "Язык приложения"}</h2>
        <LanguageSelector />
        
        <h2 className="text-2xl text-white font-serif mb-4">Подписка</h2>
        <SubscriptionManager />
        
        <LegalDocuments />
        <LogoutButton />
      </div>
    </div>
  );
};
