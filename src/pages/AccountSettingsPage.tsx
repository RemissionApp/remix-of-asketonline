import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { CompactLanguageSelector } from '@/components/ui/CompactLanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';
import UserProfileForm from '@/components/UserProfileForm';
import { LanguageSelector } from '@/components/ProfilePage/LanguageSelector';
import { LegalDocuments } from '@/components/ProfilePage/LegalDocuments';
import { DeveloperSwitch } from '@/components/DeveloperSwitch';
import { PushNotificationManager } from '@/components/notifications/PushNotificationManager';

const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-cosmic-dark text-cosmic-text">
      <StarField starCount={50} />

      {/* Cosmic background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark opacity-30" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="text-cosmic-text hover:text-cosmic-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.common?.back || 'Back'}
          </Button>
          <CompactLanguageSelector />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-md mx-auto w-full space-y-8">
          {/* Title */}
          <h1 className="text-2xl font-serif text-center text-cosmic-text">
            {t.userProfile?.title || 'Account Settings'}
          </h1>

          {/* User Profile Form */}
          <div className="w-full">
            <UserProfileForm />
          </div>

          {/* Settings Sections */}
          <div className="w-full space-y-8">
            {/* Language Settings */}
            <div>
              <h2 className="text-xl text-white font-serif mb-4">
                {t.userProfile?.languageLabel || 'Application Language'}
              </h2>
              <LanguageSelector />
            </div>

            {/* Notifications */}
            <div>
              <h2 className="text-xl text-white font-serif mb-4">
                {t.userProfile?.notifications || 'Notifications'}
              </h2>
              <PushNotificationManager />
            </div>

            {/* Developer Mode */}
            <div>
              <h2 className="text-xl text-white font-serif mb-4">
                {t.userProfile?.developerMode || 'Developer Mode'}
              </h2>
              <DeveloperSwitch />
            </div>

            {/* Legal Documents */}
            <LegalDocuments />

            {/* Data Management Section */}
            <div className="pt-6 border-t border-cosmic-accent/20 space-y-4">
              {/* Delete Data Button */}
              <button
                onClick={() => {
                  // TODO: Implement data deletion functionality
                  alert(
                    t.userProfile?.deleteDataConfirm ||
                      'Функция удаления данных будет реализована'
                  );
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/30 rounded-lg text-orange-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t.userProfile?.deleteData || 'Очистить все данные'}
              </button>

              {/* Delete Account Button */}
              <button
                onClick={() => navigate('/delete-account')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {t.userProfile?.deleteAccount || 'Удалить данные аккаунта'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
