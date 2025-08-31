import {
  Purchases,
  LOG_LEVEL,
  CustomerInfo,
  PurchasesError,
  PurchasesPackage,
  MakePurchaseResult,
} from '@revenuecat/purchases-capacitor';
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

  async initialize(userId?: string): Promise<void> {
    if (this.isConfigured) return;

    try {
      // Включаем debug логи для разработки
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

      if (Capacitor.getPlatform() === 'ios') {
        // await Purchases.configure({ apiKey: <public_apple_api_key> });
      } else if (Capacitor.getPlatform() === 'android') {
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
      }

      this.isConfigured = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings() {
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

  // Добавляем слушатель изменений CustomerInfo согласно документации
  async addCustomerInfoUpdateListener(
    callback: (customerInfo: CustomerInfo) => void
  ) {
    try {
      await Purchases.addCustomerInfoUpdateListener(callback);
    } catch (error) {
      console.error('Failed to add customer info update listener:', error);
      throw error;
    }
  }
}

export const revenueCatService = RevenueCatService.getInstance();
