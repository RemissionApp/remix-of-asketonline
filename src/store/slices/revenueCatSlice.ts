import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from '@revenuecat/purchases-capacitor';
import { revenueCatService } from '@/utils/revenueCat';
import { useAppStore } from '../useAppStore';

interface RevenueCatState {
  // State
  isInitialized: boolean;
  isLoading: boolean;
  billingAvailable: boolean | null;
  offerings: PurchasesOffering[];
  customerInfo: CustomerInfo | null;
  hasActiveSubscription: boolean;
  lastInitializedUserId: string | null;

  // Actions
  initialize: (userId?: string) => Promise<void>;
  checkActiveSubscription: (customerInfo: CustomerInfo | null) => boolean;
  syncProStatus: (customerInfo: CustomerInfo | null) => void;
  purchasePackage: (
    packageToPurchase: PurchasesPackage
  ) => Promise<CustomerInfo>;
  restorePurchases: () => Promise<CustomerInfo>;
  presentPaywall: (offeringIdentifier?: string) => Promise<any>;
  setCustomerInfo: (customerInfo: CustomerInfo | null) => void;
  setOfferings: (offerings: PurchasesOffering[]) => void;
  setLoading: (loading: boolean) => void;
  setBillingAvailable: (available: boolean | null) => void;
  reset: () => void;
}

export const useRevenueCatStore = create<RevenueCatState>()(
  persist(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      isLoading: false,
      billingAvailable: null,
      offerings: [],
      customerInfo: null,
      hasActiveSubscription: false,
      lastInitializedUserId: null,

      // Check if subscription is active
      checkActiveSubscription: (customerInfo: CustomerInfo | null): boolean => {
        console.log(
          '🔍 CHECKING SUBSCRIPTION STATUS:',
          JSON.stringify(customerInfo, null, 2)
        );

        if (!customerInfo) {
          console.log('❌ No customer info provided');
          return false;
        }

        // Проверяем активные entitlements
        const hasActiveEntitlements =
          customerInfo.entitlements?.active &&
          Object.keys(customerInfo.entitlements.active).length > 0;

        // Проверяем активные подписки
        const hasActiveSubscriptions =
          customerInfo.activeSubscriptions &&
          customerInfo.activeSubscriptions.length > 0;

        // Проверяем конкретные подписки (для совместимости)
        const hasSpecificSubscription = !!(
          customerInfo.entitlements?.active?.['asket_premium_montly'] ||
          customerInfo.entitlements?.active?.['asket_premium_yearly'] ||
          customerInfo.entitlements?.active?.['premium'] ||
          customerInfo.entitlements?.active?.['pro']
        );

        // Проверяем все купленные продукты (дополнительная проверка)
        const hasPurchasedProducts =
          customerInfo.allPurchasedProductIdentifiers &&
          customerInfo.allPurchasedProductIdentifiers.length > 0;

        const isActive =
          hasActiveEntitlements ||
          hasActiveSubscriptions ||
          hasSpecificSubscription ||
          hasPurchasedProducts;

        console.log('📊 SUBSCRIPTION CHECK RESULTS:', {
          hasActiveEntitlements,
          hasActiveSubscriptions,
          hasSpecificSubscription,
          hasPurchasedProducts,
          isActive,
          entitlements: customerInfo.entitlements,
          activeSubscriptions: customerInfo.activeSubscriptions,
          allEntitlements: customerInfo.entitlements?.all,
          allPurchasedProductIdentifiers:
            customerInfo.allPurchasedProductIdentifiers,
        });

        console.log('🎯 FINAL RESULT - isActive:', isActive);
        return isActive;
      },

      // Sync Pro status with app store
      syncProStatus: (customerInfo: CustomerInfo | null) => {
        console.log(
          '🔄 SYNCING PRO STATUS with customerInfo:',
          JSON.stringify(customerInfo, null, 2)
        );

        const { checkActiveSubscription } = get();
        const hasActive = checkActiveSubscription(customerInfo);

        console.log('📈 PRO STATUS COMPARISON:', {
          current: hasActive,
          previous: get().hasActiveSubscription,
          changed: hasActive !== get().hasActiveSubscription,
        });

        // Update RevenueCat store state
        set({
          hasActiveSubscription: hasActive,
          customerInfo,
        });

        // Sync with main app store
        const { updateProStatus } = useAppStore.getState();
        updateProStatus(hasActive);

        console.log('✅ Pro status updated in both stores:', hasActive);
      },

      // Initialize RevenueCat
      initialize: async (userId?: string) => {
        const { isInitialized, lastInitializedUserId } = get();

        // Skip initialization if already initialized for the same user
        if (isInitialized && lastInitializedUserId === userId) {
          console.log('⚠️ RevenueCat already initialized for user:', userId);
          return;
        }

        try {
          set({ isLoading: true });

          console.log(
            '🚀 REVENUECAT STORE INITIALIZE called with userId:',
            userId
          );

          await revenueCatService.initialize(userId);

          // Check billing availability
          const isBillingAvailable =
            await revenueCatService.checkBillingAvailability();
          set({ billingAvailable: isBillingAvailable });

          console.log('isBillingAvailable', isBillingAvailable);

          if (isBillingAvailable) {
            // Get offerings
            const offeringsData = await revenueCatService.getOfferings();
            console.log(
              'offeringsData',
              JSON.stringify(offeringsData, null, 2)
            );

            const offerings = offeringsData.all?.default
              ? [offeringsData.all.default]
              : [];
            set({ offerings });

            // Get customer info
            const customerInfoData = await revenueCatService.getCustomerInfo();
            console.log('🚀 INITIAL CUSTOMER INFO:', customerInfoData);

            // Sync Pro status
            const { syncProStatus } = get();
            syncProStatus(customerInfoData);

            // Setup customer info listener
            await revenueCatService.addCustomerInfoUpdateListener(
              (updatedCustomerInfo: CustomerInfo) => {
                console.log('CustomerInfo updated:', updatedCustomerInfo);
                const { syncProStatus } = get();
                syncProStatus(updatedCustomerInfo);
              }
            );
          }

          set({
            isInitialized: true,
            lastInitializedUserId: userId || null,
          });

          console.log(
            '🎉 RevenueCat initialized successfully with user:',
            userId
          );
        } catch (error) {
          console.error('❌ Failed to initialize RevenueCat:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Purchase package
      purchasePackage: async (packageToPurchase: PurchasesPackage) => {
        try {
          set({ isLoading: true });
          const result =
            await revenueCatService.purchasePackage(packageToPurchase);

          const { syncProStatus } = get();
          syncProStatus(result);

          return result;
        } catch (error) {
          console.error('Ошибка покупки:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Restore purchases
      restorePurchases: async () => {
        try {
          set({ isLoading: true });
          const customerInfo = await revenueCatService.restorePurchases();

          const { syncProStatus } = get();
          syncProStatus(customerInfo);

          return customerInfo;
        } catch (error) {
          console.error('Ошибка восстановления покупок:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Present paywall
      presentPaywall: async (offeringIdentifier?: string) => {
        try {
          set({ isLoading: true });

          const { RevenueCatUI, PAYWALL_RESULT } = await import(
            '@revenuecat/purchases-capacitor-ui'
          );
          const { Purchases } = await import('@revenuecat/purchases-capacitor');

          // Get current offerings
          const offeringsData = await Purchases.getOfferings();

          // Determine which offering to use
          const targetOffering = offeringIdentifier
            ? offeringsData.all?.[offeringIdentifier]
            : offeringsData.current;

          if (!targetOffering) {
            throw new Error('Нет доступных предложений для paywall');
          }

          // Use RevenueCatUI to show paywall
          const result = await RevenueCatUI.presentPaywall({
            offering: targetOffering,
          });

          console.log('Paywall result:', result);

          // Always update subscription status after closing paywall
          try {
            const updatedCustomerInfo =
              await revenueCatService.getCustomerInfo();
            console.log(
              '💳 UPDATED CUSTOMER INFO AFTER PAYWALL:',
              updatedCustomerInfo
            );

            const { syncProStatus } = get();
            syncProStatus(updatedCustomerInfo);
          } catch (error) {
            console.error(
              '❌ Failed to update customer info after paywall:',
              error
            );
          }

          return result;
        } catch (error) {
          console.error('Ошибка при показе paywall:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Setters
      setCustomerInfo: (customerInfo: CustomerInfo | null) => {
        set({ customerInfo });
        const { syncProStatus } = get();
        syncProStatus(customerInfo);
      },

      setOfferings: (offerings: PurchasesOffering[]) => {
        set({ offerings });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setBillingAvailable: (billingAvailable: boolean | null) => {
        set({ billingAvailable });
      },

      // Reset store
      reset: () => {
        set({
          isInitialized: false,
          isLoading: false,
          billingAvailable: null,
          offerings: [],
          customerInfo: null,
          hasActiveSubscription: false,
          lastInitializedUserId: null,
        });
      },
    }),
    {
      name: 'revenuecat-store',
      partialize: state => ({
        isInitialized: state.isInitialized,
        lastInitializedUserId: state.lastInitializedUserId,
        hasActiveSubscription: state.hasActiveSubscription,
        customerInfo: state.customerInfo,
      }),
    }
  )
);
