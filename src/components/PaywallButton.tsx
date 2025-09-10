import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useToast } from '@/hooks/use-toast';

interface PaywallButtonProps {
  variant?: 'default' | 'outline' | 'premium';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  offeringIdentifier?: string;
  children?: React.ReactNode;
}

export const PaywallButton: React.FC<PaywallButtonProps> = ({
  variant = 'premium',
  size = 'default',
  className = '',
  offeringIdentifier,
  children,
}) => {
  const { presentPaywall, isLoading, hasActiveSubscription } = useRevenueCat();
  const { toast } = useToast();

  // Если у пользователя уже есть подписка, не показываем кнопку
  if (hasActiveSubscription) {
    return null;
  }

  const handleShowPaywall = async () => {
    try {
      console.log('offeringIdentifier', offeringIdentifier);
      await presentPaywall(offeringIdentifier);
    } catch (error) {
      console.error('Error showing paywall:', error);
    }
  };

  const getButtonContent = () => {
    if (children) return children;

    switch (variant) {
      case 'premium':
        return (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Открыть Premium
          </>
        );
      case 'outline':
        return (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Премиум функции
          </>
        );
      default:
        return 'Открыть Paywall';
    }
  };

  const getButtonClasses = () => {
    let baseClasses = className;

    switch (variant) {
      case 'premium':
        baseClasses +=
          ' bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white';
        break;
      case 'outline':
        baseClasses += ' border-purple-200 text-purple-700 hover:bg-purple-50';
        break;
    }

    return baseClasses;
  };

  return (
    <Button
      variant={variant === 'premium' ? 'default' : variant}
      size={size}
      className={getButtonClasses()}
      onClick={handleShowPaywall}
      disabled={isLoading}
    >
      {isLoading ? 'Загрузка...' : getButtonContent()}
    </Button>
  );
};




