import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEntitlement } from '@/hooks/useEntitlement';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useAppStore } from '@/store/useAppStore';
import { isNativePlatform } from '@/utils/platform';

interface PaywallButtonProps {
  variant?: 'default' | 'outline' | 'premium';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  /** @deprecated kept for backwards compatibility */
  offeringIdentifier?: string;
  children?: React.ReactNode;
}

/**
 * Universal paywall trigger.
 * Hidden when the user already has access (trial OR Pro).
 * On native — opens RevenueCat paywall. On web — navigates to /comparison.
 */
export const PaywallButton: React.FC<PaywallButtonProps> = ({
  variant = 'premium',
  size = 'default',
  className = '',
  children,
}) => {
  const { user } = useAppStore();
  const { isUnlocked, loading } = useEntitlement();
  const { presentPaywall } = useRevenueCat(user?.id);
  const navigate = useNavigate();

  if (loading || isUnlocked) return null;

  const handlePress = () => {
    if (isNativePlatform()) {
      presentPaywall().catch(() => navigate('/comparison'));
    } else {
      navigate('/comparison');
    }
  };

  const content =
    children ??
    (variant === 'outline' ? (
      <>
        <Sparkles className="w-4 h-4 mr-2" />
        Премиум функции
      </>
    ) : (
      <>
        <Crown className="w-4 h-4 mr-2" />
        Открыть Premium
      </>
    ));

  const classes =
    variant === 'premium'
      ? `${className} bg-gradient-to-r from-cosmic-accent to-cosmic-gold text-cosmic-dark hover:opacity-90`
      : variant === 'outline'
        ? `${className} border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold/10`
        : className;

  return (
    <Button
      variant={variant === 'premium' ? 'default' : variant}
      size={size}
      className={classes}
      onClick={handlePress}
    >
      {content}
    </Button>
  );
};
