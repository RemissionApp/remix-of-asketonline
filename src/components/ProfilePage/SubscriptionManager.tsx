
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
    <>
      {/* Developer Mode Subscription Toggle */}
      <div className="bg-cosmic-accent/10 border border-red-500/30 rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white font-medium font-sans">Режим разработчика</span>
            <span className="text-cosmic-secondary text-sm font-sans">Быстрое переключение подписки</span>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="pro-mode" className={userProfile.isPro ? "text-cosmic-gold font-sans" : "text-cosmic-secondary font-sans"}>
              {userProfile.isPro ? "PRO" : "Бесплатно"}
            </Label>
            <Switch
              id="pro-mode"
              checked={userProfile.isPro}
              onCheckedChange={handleManageSubscription}
            />
          </div>
        </div>
      </div>
      
      {userProfile.isPro ? (
        <div className="bg-cosmic-accent/10 border border-cosmic-gold/30 rounded-lg p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium flex items-center font-sans">
                <SparklesIcon size={18} className="text-cosmic-gold mr-2" />
                ASKET PRO
              </h3>
              <p className="text-sm text-cosmic-secondary font-sans">Active subscription</p>
            </div>
            <ProBadge />
          </div>
          <CosmicButton variant="outline" className="w-full font-sans" onClick={handleManageSubscription}>
            Manage Subscription
          </CosmicButton>
        </div>
      ) : (
        <SubscriptionBanner />
      )}
    </>
  );
};
