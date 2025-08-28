import {
  Purchases,
  LOG_LEVEL,
  CustomerInfo,
  PurchasesError,
  PurchasesPackage,
  MakePurchaseResult,
} from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';
import { Capacitor } from '@capacitor/core';

// Замените на ваш API ключ из RevenueCat Dashboard
const REVENUECAT_API_KEY = 'goog_EPRsxfvWzbItUwOHnEGHBGMIuCf';

export class RevenueCatService {
  private static instance: RevenueCatService;
  private isConfigured = false;

  private constructor() {}

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  private isWebPlatform(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  async initialize(userId?: string): Promise<void> {
    if (this.isConfigured) return;

    // Skip initialization on web platform
    if (this.isWebPlatform()) {
      console.log('RevenueCat: Web platform detected, skipping initialization');
      return;
    }

    try {
      // Включаем debug логи для разработки
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

      if (Capacitor.getPlatform() === 'ios') {
        // await Purchases.configure({ apiKey: <public_apple_api_key> });
      } else if (Capacitor.getPlatform() === 'android') {
        // Передаем appUserID во время конфигурации, если userId передан
        if (userId) {
          await Purchases.configure({
            apiKey: REVENUECAT_API_KEY,
            appUserID: userId,
          });
          console.log('RevenueCat: Configured with user ID', userId);
        } else {
          await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        }
      }

      this.isConfigured = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings() {
    if (this.isWebPlatform()) {
      console.log('RevenueCat: Web platform - returning mock offerings');
      return {
        current: null,
        all: {},
      };
    }

    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error: unknown) {
      console.error('Failed to get offerings:', error);

      // Проверяем специфические ошибки
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'PurchaseNotAllowedError'
      ) {
        throw new Error(
          'Google Play Billing недоступен на этом устройстве. Используйте реальное устройство с Google Play Store.'
        );
      }

      throw error;
    }
  }

  async purchasePackage(
    packageToPurchase: PurchasesPackage
  ): Promise<CustomerInfo> {
    if (this.isWebPlatform()) {
      throw new Error('Покупки доступны только в мобильном приложении');
    }

    try {
      const result = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });
      return result.customerInfo;
    } catch (error: unknown) {
      console.error('Failed to purchase package:', error);

      // Проверяем специфические ошибки
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'PurchaseNotAllowedError'
      ) {
        throw new Error(
          'Покупки недоступны на этом устройстве. Используйте реальное устройство с Google Play Store.'
        );
      }

      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    if (this.isWebPlatform()) {
      throw new Error(
        'Восстановление покупок доступно только в мобильном приложении'
      );
    }

    try {
      const result = await Purchases.restorePurchases();
      return result.customerInfo;
    } catch (error: unknown) {
      console.error('Failed to restore purchases:', error);

      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'PurchaseNotAllowedError'
      ) {
        throw new Error(
          'Восстановление покупок недоступно на этом устройстве.'
        );
      }

      throw error;
    }
  }

  async getCustomerInfo() {
    if (this.isWebPlatform()) {
      console.log('RevenueCat: Web platform - returning mock customer info');
      return {
        customerInfo: {
          entitlements: { active: {} },
          activeSubscriptions: [],
          allPurchasedProductIdentifiers: [],
          latestExpirationDate: null,
          firstSeen: new Date().toISOString(),
          originalAppUserId: '',
          requestDate: new Date().toISOString(),
          allExpirationDates: {},
          allPurchaseDates: {},
          nonSubscriptionTransactions: [],
          originalPurchaseDate: null,
          managementURL: null,
        } as CustomerInfo,
      };
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      console.log('customerInfo', customerInfo);
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async identifyUser(userId: string) {
    if (this.isWebPlatform()) {
      console.log('RevenueCat: Web platform - skipping user identification');
      return {
        customerInfo: {
          entitlements: { active: {} },
          activeSubscriptions: [],
        },
      };
    }

    try {
      const customerInfo = await Purchases.logIn({ appUserID: userId });
      return customerInfo;
    } catch (error) {
      console.error('Failed to identify user:', error);
      throw error;
    }
  }

  // Новый метод для проверки доступности Google Play Billing
  async checkBillingAvailability(): Promise<boolean> {
    if (this.isWebPlatform()) {
      console.log('RevenueCat: Web platform - billing not available');
      return false;
    }

    try {
      await this.getOfferings();
      return true;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'PurchaseNotAllowedError'
      ) {
        return false;
      }
      throw error;
    }
  }

  // Новый метод для показа Paywall
  async presentPaywall(
    offeringIdentifier?: string
  ): Promise<CustomerInfo | null> {
    try {
      console.log('Presenting RevenueCat Paywall...');

      let offering;
      if (offeringIdentifier) {
        // Получаем полный объект offering по identifier
        const offerings = await this.getOfferings();
        offering = offerings.all?.[offeringIdentifier] || offerings.current;
      }

      const result = await RevenueCatUI.presentPaywall({
        offering: offering,
      });

      console.log('Paywall result:', result);

      // Проверяем результат paywall
      if (result.result === 'PURCHASED' || result.result === 'RESTORED') {
        // Получаем обновленную информацию о пользователе
        const customerInfo = await this.getCustomerInfo();
        return customerInfo.customerInfo;
      }

      return null;
    } catch (error) {
      console.error('Failed to present paywall:', error);

      // Проверяем, была ли покупка отменена пользователем
      if (
        error &&
        typeof error === 'object' &&
        'userCancelled' in error &&
        error.userCancelled
      ) {
        console.log('User cancelled paywall');
        return null;
      }

      throw error;
    }
  }

  // Метод для получения информации о Paywall
  async getPaywallInfo(offeringIdentifier?: string) {
    try {
      // RevenueCatUI не имеет метода getPaywallInfo, используем getOfferings
      const offerings = await this.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Failed to get paywall info:', error);
      throw error;
    }
  }

  // Добавляем слушатель изменений CustomerInfo согласно документации
  async addCustomerInfoUpdateListener(
    callback: (customerInfo: CustomerInfo) => void
  ) {
    // Skip on web platform
    if (this.isWebPlatform()) {
      console.log('RevenueCat: Web platform - skipping customer info listener');
      return;
    }

    try {
      await Purchases.addCustomerInfoUpdateListener(callback);
    } catch (error) {
      console.error('Failed to add customer info update listener:', error);
      throw error;
    }
  }

  // Метод для сброса состояния RevenueCat при смене пользователя
  async resetState(): Promise<void> {
    if (this.isWebPlatform()) {
      console.log('RevenueCat: Web platform - skipping reset');
      return;
    }

    try {
      // Сбрасываем флаг конфигурации
      this.isConfigured = false;

      // Очищаем идентификацию пользователя
      await Purchases.logOut();

      console.log('RevenueCat state reset successfully');
    } catch (error) {
      console.error('Failed to reset RevenueCat state:', error);
      // Не выбрасываем ошибку, так как это может быть нормальным поведением
    }
  }
}

export const revenueCatService = RevenueCatService.getInstance();
