import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SparklesIcon } from 'lucide-react';
import { ProBadge } from '@/components/ProBadge';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { CosmicButton } from '@/components/CosmicButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const SubscriptionManager: React.FC = () => {
  const { userProfile, upgradeToPro, cancelProSubscription } = useAppStore();

  const handleManageSubscription = () => {
    if (userProfile?.isPro) {
      // For demo purposes, just toggle the subscription
      cancelProSubscription();
    } else {
      upgradeToPro();
    }
  };

  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon size={20} className="text-cosmic-accent" />
        <span className="text-white font-medium font-sans">Подписка</span>
      </div>

      {userProfile.isPro ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium flex items-center font-sans">
                ASKET PRO
              </h3>
              <p className="text-sm text-cosmic-secondary font-sans">
                Активная подписка
              </p>
            </div>
            <ProBadge />
          </div>
          <CosmicButton
            variant="outline"
            className="w-full font-sans"
            onClick={handleManageSubscription}
          >
            Управление подпиской
          </CosmicButton>
        </div>
      ) : (
        <div className="space-y-4">
          <SubscriptionBanner />
        </div>
      )}
    </div>
  );
};
