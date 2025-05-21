
import React, { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { LanguageSelector } from './LanguageSelector';
import { SubscriptionManager } from './SubscriptionManager';
import { LegalDocuments } from './LegalDocuments';
import { LogoutButton } from './LogoutButton';
import UserProfileForm from '@/components/UserProfileForm';
import { DeveloperSwitch } from '@/components/DeveloperSwitch';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const ProfileSection: React.FC = () => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleProfileUpdateSuccess = () => {
    toast({
      title: t.userProfile?.profileUpdated || "Profile Updated",
      description: t.userProfile?.profileUpdateSuccess || "Your profile has been updated successfully.",
    });
  };
  
  return (
    <div className="w-full">
      <h1 className="text-3xl text-white font-serif mb-6">
        {t.main?.profile || "Profile"}
      </h1>
      
      <UserProfileForm onSuccess={handleProfileUpdateSuccess} />
      
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl text-white font-serif mb-4">{t.userProfile?.languageLabel || "Application Language"}</h2>
        <LanguageSelector />
        
        <h2 className="text-2xl text-white font-serif mb-4">{t.subscription?.title || "Subscription"}</h2>
        <SubscriptionManager />
        
        {/* Add Developer Switch here to replace the one from MainPage */}
        <h2 className="text-2xl text-white font-serif mb-4">Developer Mode</h2>
        <DeveloperSwitch />
        
        <LegalDocuments />
        <LogoutButton />
      </div>
    </div>
  );
};

export default ProfileSection;
