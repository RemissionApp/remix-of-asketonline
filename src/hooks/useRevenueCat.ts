import { useState, useEffect, useRef } from 'react';
import {
  Purchases,
  LOG_LEVEL,
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from '@revenuecat/purchases-capacitor';
import { revenueCatService } from '@/utils/revenueCat';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import { log } from 'console';

export const useRevenueCat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billingAvailable, setBillingAvailable] = useState<boolean | null>(
    null
  );
  const { toast } = useToast();
  const { updateProStatus } = useAppStore();

  // Используем ref для отслеживания текущего Pro статуса
  const currentProStatusRef = useRef<boolean>(false);

  useEffect(() => {
    initializeRevenueCat();

    // Добавляем слушатель изменений CustomerInfo согласно документации
    const setupCustomerInfoListener = async () => {
      // Skip on web platform
      if (typeof window !== 'undefined' && !(window as any).Capacitor) {
        return;
      }

      try {
        await revenueCatService.addCustomerInfoUpdateListener(
          (updatedCustomerInfo: CustomerInfo) => {
            setCustomerInfo(updatedCustomerInfo);
            console.log('CustomerInfo updated:', updatedCustomerInfo);
            // Синхронизируем статус Pro с app store
            syncProStatus(updatedCustomerInfo);
          }
        );
      } catch (error) {
        console.error('Failed to setup customer info listener:', error);
      }
    };

    setupCustomerInfoListener();
  }, []);

  // Функция для синхронизации Pro статуса с app store
  const syncProStatus = (customerInfo: CustomerInfo | null) => {
    const hasActive =
      customerInfo?.entitlements?.active &&
      Object.keys(customerInfo.entitlements.active).length > 0;

    // Обновляем профиль только если статус изменился
    if (hasActive !== currentProStatusRef.current) {
      currentProStatusRef.current = hasActive;
      updateProStatus(hasActive);
      console.log('Pro status updated:', hasActive);
    }
  };

  const initializeRevenueCat = async () => {
    // Check if we're running on web and skip initialization
    if (typeof window !== 'undefined' && !(window as any).Capacitor) {
      console.log('RevenueCat: Skipping initialization on web platform');
      setIsInitialized(false);
      setBillingAvailable(false);
      return;
    }

    try {
      setIsLoading(true);
      await revenueCatService.initialize();
      setIsInitialized(true);

      // Проверка доступности Google Play Billing
      const isBillingAvailable =
        await revenueCatService.checkBillingAvailability();
      setBillingAvailable(isBillingAvailable);

      console.log('isBillingAvailable', isBillingAvailable);
      if (isBillingAvailable) {
        // Получаем предложения
        const offeringsData = await revenueCatService.getOfferings();
        console.log('offeringsData', JSON.stringify(offeringsData, null, 2));
        setOfferings(
          offeringsData.all?.default ? [offeringsData.all.default] : []
        );

        // Получаем информацию о пользователе
        const customerInfoData = await revenueCatService.getCustomerInfo();
        setCustomerInfo(customerInfoData.customerInfo);

        // Синхронизируем Pro статус при инициализации
        syncProStatus(customerInfoData.customerInfo);
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
      setIsInitialized(false);
      setBillingAvailable(false);
      // Silently fail on web, only show toast on native platforms
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        toast({
          title: 'Ошибка инициализации',
          description: 'Не удалось инициализировать систему покупок',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePackage = async (packageToPurchase: PurchasesPackage) => {
    try {
      setIsLoading(true);
      const result = await revenueCatService.purchasePackage(packageToPurchase);
      setCustomerInfo(result);

      // Синхронизируем Pro статус после покупки
      syncProStatus(result);

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

      // Синхронизируем Pro статус после восстановления
      syncProStatus(customerInfo);

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

  // Проверяем, есть ли активная подписка (любая)
  const hasActiveSubscription =
    customerInfo?.entitlements?.active &&
    Object.keys(customerInfo.entitlements.active).length > 0;

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
