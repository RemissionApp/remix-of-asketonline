
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
      <div className="bg-cosmic-accent/10 border border-red-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white font-medium">Режим разработчика</span>
            <span className="text-cosmic-secondary text-sm">Быстрое переключение подписки</span>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="pro-mode" className={userProfile.isPro ? "text-cosmic-gold" : "text-cosmic-secondary"}>
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
        <div className="bg-cosmic-accent/10 border border-cosmic-gold/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-medium flex items-center">
                <SparklesIcon size={16} className="text-cosmic-gold mr-2" />
                ASKET PRO
              </h3>
              <p className="text-sm text-cosmic-secondary">Active subscription</p>
            </div>
            <ProBadge />
          </div>
          <CosmicButton variant="outline" className="w-full" onClick={handleManageSubscription}>
            Manage Subscription
          </CosmicButton>
        </div>
      ) : (
        <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-white font-medium">Премиум доступ</h3>
              <p className="text-sm text-cosmic-secondary">Откройте все функции приложения</p>
            </div>
          </div>
          <CosmicButton 
            variant="gold" 
            className="w-full" 
            onClick={handleManageSubscription}
          >
            <SparklesIcon size={16} className="mr-2" />
            Unlock PRO
          </CosmicButton>
        </div>
      )}
    </>
  );
};
