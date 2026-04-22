import { useEffect } from 'react';
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { useToast } from '@/hooks/use-toast';
import { useRevenueCatStore } from '@/store/slices/revenueCatSlice';

export const useRevenueCat = (userId?: string) => {
  const { toast } = useToast();

  // Get state and actions from store
  const {
    isInitialized,
    isLoading,
    billingAvailable,
    offerings,
    customerInfo,
    hasActiveSubscription,
    initialize,
    purchasePackage,
    restorePurchases,
    presentPaywall,
  } = useRevenueCatStore();

  // Initialize RevenueCat when userId changes
  useEffect(() => {
    if (userId) {
      initialize(userId).catch(error => {
        const message = error instanceof Error ? error.message : String(error);
        // Native-only plugin — silent skip on web
        if (message.includes('Web not supported')) {
          console.info('RevenueCat not available on web platform');
          return;
        }
        console.error('Failed to initialize RevenueCat:', error);
        toast({
          title: 'Ошибка инициализации',
          description: 'Не удалось инициализировать систему покупок',
          variant: 'destructive',
        });
      });
    }
  }, [userId, initialize, toast]);

  // Wrapper functions with toast notifications
  const purchasePackageWithToast = async (
    packageToPurchase: PurchasesPackage
  ) => {
    try {
      const result = await purchasePackage(packageToPurchase);
      toast({
        title: 'Покупка успешна!',
        description: 'Спасибо за покупку!',
      });
      return result;
    } catch (error: unknown) {
      console.error('Ошибка покупки:', error);

      // Check if purchase was cancelled by user
      if (
        error &&
        typeof error === 'object' &&
        'userCancelled' in error &&
        error.userCancelled
      ) {
        toast({
          title: 'Покупка отменена',
          description: 'Вы отменили покупку',
        });
      } else {
        toast({
          title: 'Ошибка покупки',
          description:
            error instanceof Error
              ? error.message
              : 'Не удалось совершить покупку',
          variant: 'destructive',
        });
      }

      throw error;
    }
  };

  const restorePurchasesWithToast = async () => {
    try {
      const result = await restorePurchases();
      toast({
        title: 'Покупки восстановлены',
        description: 'Ваши покупки успешно восстановлены',
      });
      return result;
    } catch (error) {
      console.error('Ошибка восстановления покупок:', error);
      toast({
        title: 'Ошибка восстановления',
        description: 'Не удалось восстановить покупки',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const presentPaywallWithToast = async (offeringIdentifier?: string) => {
    try {
      const result = await presentPaywall(offeringIdentifier);

      // Handle result with toast notifications
      const { PAYWALL_RESULT } = await import(
        '@revenuecat/purchases-capacitor-ui'
      );

      switch (result.result) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          toast({
            title: 'Успешно!',
            description: 'PRO функции разблокированы!',
          });
          break;
        case PAYWALL_RESULT.CANCELLED:
          toast({
            title: 'Покупка отменена',
            description: 'Вы отменили покупку',
          });
          break;
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        default:
          toast({
            title: 'Ошибка paywall',
            description: 'Не удалось открыть paywall',
            variant: 'destructive',
          });
          break;
      }

      return result;
    } catch (error: unknown) {
      console.error('Ошибка при показе paywall:', error);
      toast({
        title: 'Ошибка paywall',
        description:
          error instanceof Error ? error.message : 'Не удалось открыть paywall',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    isInitialized,
    offerings,
    customerInfo,
    isLoading,
    billingAvailable,
    hasActiveSubscription,
    purchasePackage: purchasePackageWithToast,
    restorePurchases: restorePurchasesWithToast,
    presentPaywall: presentPaywallWithToast,
  };
};
