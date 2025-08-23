import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { SubscriptionManager } from './SubscriptionManager';
import { LogoutButton } from './LogoutButton';

export const ProfileSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { userProfile } = useAppStore();

  return (
    <div className="w-full">
      <h1 className="text-3xl text-white font-serif mb-6">
        {t.main?.profile || 'Profile'}
      </h1>

      {/* User Info Display */}
      <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center">
            <User className="w-8 h-8 text-cosmic-accent" />
          </div>
          <div>
            <h2 className="text-xl text-white font-serif">
              {userProfile.name || t.auth?.defaultUserName || 'Искатель'}
            </h2>
            {userProfile.birthDate && (
              <p className="text-cosmic-text/70">
                {new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear()} {t.userProfile?.age || 'лет'}
              </p>
            )}
          </div>
        </div>

        {/* Account Settings Button */}
        <button
          onClick={() => navigate('/account-settings')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cosmic-accent/20 hover:bg-cosmic-accent/30 border border-cosmic-accent/30 rounded-lg text-cosmic-text transition-colors"
        >
          <Settings className="w-4 h-4" />
          {t.userProfile?.accountSettings || 'Настройки аккаунта'}
        </button>
      </div>

      {/* Subscription Manager */}
      <SubscriptionManager />

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};
