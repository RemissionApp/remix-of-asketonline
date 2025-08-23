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

        {/* Delete Account Button */}
        <div className="mt-8 pt-6 border-t border-cosmic-accent/20">
          <button
            onClick={() => window.location.href = '/delete-account'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t.userProfile?.deleteAccount || 'Удалить данные аккаунта'}
          </button>
        </div>
      </div>
    </div>
  );
};
