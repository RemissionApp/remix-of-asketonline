import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, MedalIcon } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Card, CardContent } from '@/components/ui/card';
import { CosmicButton } from './CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { useRevenueCat } from '@/hooks/useRevenueCat';

interface SubscriptionBannerProps {
  className?: string;
  variant?: 'default' | 'compact';
  onUpgrade?: () => void;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  className = '',
  variant = 'default',
  onUpgrade,
}) => {
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { upgradeToPro, user } = useAppStore();
  const { hasActiveSubscription, offerings, presentPaywall, isLoading } =
    useRevenueCat(user?.id);

  // Don't show banner if user has active subscription
  if (hasActiveSubscription) {
    return null;
  }

  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade();
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await presentPaywall();
      } else {
        navigate('/comparison');
      }
    } catch (error) {
      console.error('Failed to present paywall:', error);
      // Fallback to demo behavior on error
      upgradeToPro();
      navigate('/comparison');
    }
  };

  if (variant === 'compact') {
    return (
      <Card
        className={`border-cosmic-gold/30 bg-gradient-to-r from-cosmic-dark/80 to-cosmic-accent/20 backdrop-blur-sm ${className}`}
      >
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon size={20} className="text-cosmic-gold mr-2" />
            <span className="text-sm text-cosmic-secondary">
              {t.subscription?.description || 'Unlock full potential with PRO'}
            </span>
          </div>
          <CosmicButton onClick={handleUpgrade} size="sm" disabled={isLoading}>
            {isLoading
              ? 'Processing...'
              : t.subscription?.upgradeButton || 'Upgrade Now'}
          </CosmicButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-cosmic-gold/30 bg-gradient-to-r from-cosmic-dark/80 to-cosmic-accent/20 backdrop-blur-sm ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <div className="w-16 h-16 bg-cosmic-gold/20 rounded-full flex items-center justify-center">
              <SparklesIcon size={32} className="text-cosmic-gold" />
            </div>
          </div>

          <div className="flex-grow text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-serif text-white mb-1">
              {t.subscription?.title || 'PRO Subscription'}
            </h3>
            <p className="text-sm text-cosmic-secondary">
              {t.subscription?.description ||
                'Unlock the full potential of the app'}
            </p>
            <div className="mt-2 flex items-center justify-center md:justify-start text-xs text-cosmic-gold">
              <MedalIcon size={14} className="mr-1" />
              <span>Unlimited meditations, multiple ascesis & more!</span>
            </div>
          </div>

          <CosmicButton
            onClick={handleUpgrade}
            className="whitespace-nowrap"
            disabled={isLoading}
          >
            <SparklesIcon size={16} className="mr-2" />
            {isLoading ? 'Processing...' : 'Unlock PRO'}
          </CosmicButton>
        </div>
      </CardContent>
    </Card>
  );
};
