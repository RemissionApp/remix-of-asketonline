import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { ProBadge } from './ProBadge';

export const DeveloperSwitch: React.FC = () => {
  const { userProfile, upgradeToPro, cancelProSubscription } = useAppStore();
  const isPro = userProfile?.isPro || false;

  const handleToggleSubscription = async (checked: boolean) => {
    if (checked) {
      await upgradeToPro();
    } else {
      await cancelProSubscription();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between bg-cosmic-dark/70 backdrop-blur-sm p-3 rounded-lg border border-cosmic-gold/20">
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="dev-mode"
            className="text-cosmic-secondary cursor-pointer"
          >
            Developer Mode: Pro Subscription
          </Label>
          {isPro && <ProBadge size="sm" />}
        </div>
        <Switch
          id="dev-mode"
          checked={isPro}
          onCheckedChange={handleToggleSubscription}
        />
      </div>
    </div>
  );
};
