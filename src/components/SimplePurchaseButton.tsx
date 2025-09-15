import React from 'react';
import { Button } from '@/components/ui/button';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useAppStore } from '@/store/useAppStore';
import { ShoppingCart, Crown, AlertTriangle } from 'lucide-react';

export const SimplePurchaseButton: React.FC = () => {
  const { user } = useAppStore();
  const {
    hasActiveSubscription,
    isInitialized,
    offerings,
    isLoading,
    purchasePackage,
    billingAvailable,
  } = useRevenueCat(user?.id);

  const handlePurchase = async () => {
    if (!offerings.length || !offerings[0].availablePackages.length) {
      return;
    }

    try {
      const firstPackage = offerings[0].availablePackages[0];
      await purchasePackage(firstPackage);
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  if (hasActiveSubscription) {
    return (
      <Button disabled className="w-full max-w-sm">
        <Crown className="h-4 w-4 mr-2" />
        Подписка активна
      </Button>
    );
  }

  if (billingAvailable === false) {
    return (
      <Button disabled className="w-full max-w-sm" variant="outline">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Google Play недоступен
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading || !isInitialized || !offerings.length}
      className="w-full max-w-sm"
      variant="default"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isLoading ? 'Загрузка...' : 'Купить Premium'}
    </Button>
  );
};
