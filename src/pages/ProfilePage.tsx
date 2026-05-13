import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { BottomNavigation } from '@/components/BottomNavigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { ProfileTabs, ProfileTabId } from '@/components/profile/ProfileTabs';
import { ProfileIdentityTab } from '@/components/profile/ProfileIdentityTab';
import { ProfileSpiritualTab } from '@/components/profile/ProfileSpiritualTab';
import { ProfileSubscriptionTab } from '@/components/profile/ProfileSubscriptionTab';
import { ProfileNotificationsTab } from '@/components/profile/ProfileNotificationsTab';
import { ProfilePrivacyTab } from '@/components/profile/ProfilePrivacyTab';
import { ProfileAccountTab } from '@/components/profile/ProfileAccountTab';

const VALID_TABS: ProfileTabId[] = ['identity','spiritual','subscription','notifications','privacy','account'];

const ProfilePage: React.FC = () => {
  const { language } = useAppStore();
  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab') as ProfileTabId | null;
  const active: ProfileTabId = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'identity';

  const setActive = (id: ProfileTabId) => {
    const next = new URLSearchParams(params);
    next.set('tab', id);
    setParams(next, { replace: true });
  };

  const title = language === 'ru' ? 'Профиль' : language === 'es' ? 'Perfil' : 'Profile';

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-page">
        <StarField starCount={80} />
        <PageHeader title={title} />
        <div className="flex-1 relative z-10 px-3 pt-page sm:px-4 max-w-lg mx-auto w-full flex flex-col gap-4">
          <ProfileTabs active={active} onChange={setActive} />
          <div className="pt-1">
            {active === 'identity' && <ProfileIdentityTab />}
            {active === 'spiritual' && <ProfileSpiritualTab />}
            {active === 'subscription' && <ProfileSubscriptionTab />}
            {active === 'notifications' && <ProfileNotificationsTab />}
            {active === 'privacy' && <ProfilePrivacyTab />}
            {active === 'account' && <ProfileAccountTab />}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default ProfilePage;
