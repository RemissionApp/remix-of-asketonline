import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { LanguageSelector } from './LanguageSelector';
import { SubscriptionManager } from './SubscriptionManager';
import { LegalDocuments } from './LegalDocuments';
import { LogoutButton } from './LogoutButton';
import UserProfileForm from '@/components/UserProfileForm';
import { DeveloperSwitch } from '@/components/DeveloperSwitch';
import { PushNotificationManager } from '@/components/notifications/PushNotificationManager';
import { NotificationTester } from '@/components/notifications/NotificationTester';

export const ProfileSection: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="w-full">
      <h1 className="text-3xl text-white font-serif mb-6">
        {t.main?.profile || 'Profile'}
      </h1>

      <UserProfileForm />

      <div className="mt-10 space-y-6">
        <h2 className="text-2xl text-white font-serif mb-4">
          {t.userProfile?.languageLabel || 'Application Language'}
        </h2>
        <LanguageSelector />

        <SubscriptionManager />

        <PushNotificationManager />

        {/* Add Developer Switch here to replace the one from MainPage */}
        <h2 className="text-2xl text-white font-serif mb-4">Developer Mode</h2>
        <DeveloperSwitch />

        <div className="mt-6">
          <NotificationTester />
        </div>

        <LegalDocuments />
      </div>
    </div>
  );
};
