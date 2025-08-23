import { useState, useEffect } from 'react';
import {
  Purchases,
  LOG_LEVEL,
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from '@revenuecat/purchases-capacitor';
import { revenueCatService } from '@/utils/revenueCat';
import { useToast } from '@/hooks/use-toast';

export const useRevenueCat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billingAvailable, setBillingAvailable] = useState<boolean | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    initializeRevenueCat();

    // Добавляем слушатель изменений CustomerInfo согласно документации
    const setupCustomerInfoListener = async () => {
      try {
        await revenueCatService.addCustomerInfoUpdateListener(
          (updatedCustomerInfo: CustomerInfo) => {
            setCustomerInfo(updatedCustomerInfo);
            console.log('CustomerInfo updated:', updatedCustomerInfo);
          }
        );
      } catch (error) {
        console.error('Failed to setup customer info listener:', error);
      }
    };

    setupCustomerInfoListener();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      setIsLoading(true);
      await revenueCatService.initialize();
      setIsInitialized(true);

      // Проверка доступности Google Play Billing
      const isBillingAvailable =
        await revenueCatService.checkBillingAvailability();
      setBillingAvailable(isBillingAvailable);

      if (isBillingAvailable) {
        // Получаем предложения
        const offeringsData = await revenueCatService.getOfferings();
        setOfferings(offeringsData.current ? [offeringsData.current] : []);

        // Получаем информацию о пользователе
        const customerInfoData = await revenueCatService.getCustomerInfo();
        setCustomerInfo(customerInfoData);

        toast({
          title: 'RevenueCat инициализирован',
          description: 'Система покупок готова к работе',
        });
      } else {
        toast({
          title: 'Google Play Billing недоступен',
          description:
            'Используйте реальное устройство для тестирования покупок',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Ошибка инициализации RevenueCat:', error);
      toast({
        title: 'Ошибка инициализации',
        description: 'Не удалось инициализировать систему покупок',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePackage = async (packageToPurchase: PurchasesPackage) => {
    try {
      setIsLoading(true);
      const result = await revenueCatService.purchasePackage(packageToPurchase);
      setCustomerInfo(result);

      toast({
        title: 'Покупка успешна!',
        description: 'Спасибо за покупку!',
      });

      return result;
    } catch (error: unknown) {
      console.error('Ошибка покупки:', error);

      // Проверяем, была ли покупка отменена пользователем
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
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      const customerInfo = await revenueCatService.restorePurchases();
      setCustomerInfo(customerInfo);

      toast({
        title: 'Покупки восстановлены',
        description: 'Ваши покупки успешно восстановлены',
      });

      return customerInfo;
    } catch (error) {
      console.error('Ошибка восстановления покупок:', error);
      toast({
        title: 'Ошибка восстановления',
        description: 'Не удалось восстановить покупки',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Проверяем, есть ли активная подписка
  const hasActiveSubscription =
    customerInfo?.entitlements.active['asket_premium_montly'];

  return {
    isInitialized,
    offerings,
    customerInfo,
    isLoading,
    billingAvailable,
    hasActiveSubscription,
    purchasePackage,
    restorePurchases,
  };
};
