import {
  Purchases,
  LOG_LEVEL,
  CustomerInfo,
  PurchasesError,
  PurchasesPackage,
  MakePurchaseResult,
} from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

// API ключи из RevenueCat Dashboard
const REVENUECAT_ANDROID_API_KEY = 'goog_EPRsxfvWzbItUwOHnEGHBGMIuCf';
const REVENUECAT_IOS_API_KEY = 'app5fa3862f65';

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
    console.log('🚀 REVENUECAT INITIALIZE called with userId:', userId);

    if (this.isConfigured) {
      console.log('⚠️ RevenueCat already configured, skipping');
      return;
    }

    try {
      // Включаем debug логи для разработки
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      console.log('📝 RevenueCat debug logging enabled');

      if (Capacitor.getPlatform() === 'ios') {
        console.log('🍎 iOS platform detected');
        console.log(
          '🔑 Configuring RevenueCat with iOS API key and userId:',
          userId
        );
        await Purchases.configure({
          apiKey: REVENUECAT_IOS_API_KEY,
          appUserID: userId,
        });
        console.log('✅ RevenueCat configured successfully for iOS');
      } else if (Capacitor.getPlatform() === 'android') {
        console.log('🤖 Android platform detected');
        console.log(
          '🔑 Configuring RevenueCat with Android API key and userId:',
          userId
        );
        await Purchases.configure({
          apiKey: REVENUECAT_ANDROID_API_KEY,
          appUserID: userId,
        });
        console.log('✅ RevenueCat configured successfully for Android');
      } else {
        console.log('🌐 Web platform detected - RevenueCat not available');
        console.warn('RevenueCat is not supported on web platform');
        // На веб-платформе RevenueCat не работает, но не бросаем ошибку
        this.isConfigured = true;
        return;
      }

      this.isConfigured = true;
      console.log('🎉 RevenueCat initialized successfully with user:', userId);
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
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
      console.log('📞 Getting customer info from RevenueCat...');
      const customerInfo = await Purchases.getCustomerInfo();
      console.log(
        '📋 CUSTOMER INFO RECEIVED:',
        JSON.stringify(customerInfo, null, 2)
      );
      console.log(
        '🔍 CUSTOMER INFO DETAILS:',
        JSON.stringify(
          {
            activeSubscriptions: customerInfo.customerInfo?.activeSubscriptions,
            entitlements: customerInfo.customerInfo?.entitlements,
            allPurchasedProductIdentifiers:
              customerInfo.customerInfo?.allPurchasedProductIdentifiers,
            originalAppUserId: customerInfo.customerInfo?.originalAppUserId,
            firstSeen: customerInfo.customerInfo?.firstSeen,
            originalPurchaseDate:
              customerInfo.customerInfo?.originalPurchaseDate,
          },
          null,
          2
        )
      );
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
