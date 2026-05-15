import {
  Purchases,
  LOG_LEVEL,
  CustomerInfo,
  PurchasesError,
  PurchasesPackage,
  MakePurchaseResult,
} from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

// API ключи из RevenueCat Dashboard (env override + safe fallback for legacy builds)
const REVENUECAT_ANDROID_API_KEY =
  import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY ||
  'goog_EPRsxfvWzbItUwOHnEGHBGMIuCf';
const REVENUECAT_IOS_API_KEY =
  import.meta.env.VITE_REVENUECAT_IOS_API_KEY ||
  'appl_SFBeDRUZdFrEaMxEmovtiUEhcdf';

export class RevenueCatService {
  private static instance: RevenueCatService;
  private isConfigured = false;
  private billingAvailableCache: boolean | null = null;

  private constructor() {}

  public static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  async initialize(userId?: string): Promise<void> {
    if (this.isConfigured) {
      return;
    }

    try {
      // DEBUG только в dev — в production оставляем INFO, чтобы не спамить логи покупок.
      await Purchases.setLogLevel({
        level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO,
      });

      if (Capacitor.getPlatform() === 'ios') {
        await Purchases.configure({
          apiKey: REVENUECAT_IOS_API_KEY,
          appUserID: userId,
        });
      } else if (Capacitor.getPlatform() === 'android') {
        await Purchases.configure({
          apiKey: REVENUECAT_ANDROID_API_KEY,
          appUserID: userId,
        });
      } else {
        // На веб-платформе RevenueCat не работает, но не бросаем ошибку.
        this.isConfigured = true;
        return;
      }

      this.isConfigured = true;
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Отвязывает текущий appUserID. Безопасно вызывать на web/desktop —
   * там SDK не сконфигурирован и ошибка просто проглатывается.
   * Используется при удалении аккаунта / смене пользователя.
   */
  async logOut(): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) return;
      await (Purchases as any).logOut();
    } catch (e) {
      console.warn('RevenueCat logOut failed (non-fatal)', e);
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
      return customerInfo.customerInfo;
    } catch (error) {
      console.error('❌ Failed to get customer info:', error);
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

  // Проверка доступности billing. Результат кешируется на сессию,
  // чтобы не делать второй getOfferings() во время инициализации.
  async checkBillingAvailability(): Promise<boolean> {
    if (this.billingAvailableCache !== null) {
      return this.billingAvailableCache;
    }
    try {
      await this.getOfferings();
      this.billingAvailableCache = true;
      return true;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code === 'PurchaseNotAllowedError'
      ) {
        this.billingAvailableCache = false;
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
