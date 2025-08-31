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

          {/* Developer Mode Toggle */}
          <div className="pt-3 border-t border-cosmic-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-cosmic-secondary text-sm font-sans">
                  Режим разработчика
                </span>
                <span className="text-cosmic-secondary text-xs font-sans">
                  Быстрое переключение
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="pro-mode"
                  className="text-cosmic-gold font-sans text-sm"
                >
                  PRO
                </Label>
                <Switch
                  id="pro-mode"
                  checked={userProfile.isPro}
                  onCheckedChange={handleManageSubscription}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <SubscriptionBanner />

          {/* Developer Mode Toggle */}
          <div className="pt-3 border-t border-cosmic-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-cosmic-secondary text-sm font-sans">
                  Режим разработчика
                </span>
                <span className="text-cosmic-secondary text-xs font-sans">
                  Быстрое переключение
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="pro-mode"
                  className="text-cosmic-secondary font-sans text-sm"
                >
                  Бесплатно
                </Label>
                <Switch
                  id="pro-mode"
                  checked={userProfile.isPro}
                  onCheckedChange={handleManageSubscription}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
