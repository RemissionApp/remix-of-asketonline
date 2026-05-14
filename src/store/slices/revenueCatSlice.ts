import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from '@revenuecat/purchases-capacitor';
import { revenueCatService } from '@/utils/revenueCat';
import { useAppStore } from '../useAppStore';
import { Capacitor } from '@capacitor/core';

// Module-level promise for deduplication of concurrent initialize() calls
let initializingPromise: Promise<void> | null = null;

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
        if (!customerInfo) return false;

        // Проверяем активные entitlements
        const hasActiveEntitlements =
          customerInfo.entitlements?.active &&
          Object.keys(customerInfo.entitlements.active).length > 0;

        // Проверяем активные подписки
        const hasActiveSubscriptions =
          customerInfo.activeSubscriptions &&
          customerInfo.activeSubscriptions.length > 0;

        // Проверяем конкретные entitlements (для совместимости).
        // Корректный ID — `asket_premium_monthly`. Старый `asket_premium_montly`
        // (опечатка) — TODO: удалить после 2026-07-14, когда все активные
        // подписки на старом ID мигрируют.
        const hasSpecificSubscription = !!(
          customerInfo.entitlements?.active?.['asket_premium_monthly'] ||
          customerInfo.entitlements?.active?.['asket_premium_montly'] || // legacy typo
          customerInfo.entitlements?.active?.['asket_premium_yearly'] ||
          customerInfo.entitlements?.active?.['premium'] ||
          customerInfo.entitlements?.active?.['pro']
        );

        // ВАЖНО: НЕ используем allPurchasedProductIdentifiers — он включает
        // истёкшие/возвращённые покупки и приводит к незаслуженному PRO.
        return Boolean(
          hasActiveEntitlements || hasActiveSubscriptions || hasSpecificSubscription
        );
      },

      // Sync Pro status with app store
      syncProStatus: (customerInfo: CustomerInfo | null) => {
        const { checkActiveSubscription } = get();
        const hasActive = checkActiveSubscription(customerInfo);

        // Update RevenueCat store state
        set({
          hasActiveSubscription: hasActive,
          customerInfo,
        });

        // Sync with main app store
        const { updateProStatus } = useAppStore.getState();
        updateProStatus(hasActive);

        // NOTE: Subscriptions are now written exclusively by the
        // `revenuecat-webhook` edge function (service role). Client must
        // never write to public.subscriptions — RLS now blocks it and the
        // webhook is the single source of truth.
      },

      // Initialize RevenueCat
      initialize: async (userId?: string) => {
        const { isInitialized, lastInitializedUserId } = get();

        // Skip initialization if already initialized for the same user
        if (isInitialized && lastInitializedUserId === userId) {
          console.log('⚠️ RevenueCat already initialized for user:', userId);
          return;
        }

        // Deduplicate concurrent initialize() calls (multiple components mounting at once)
        if (initializingPromise) {
          console.log('⏳ RevenueCat initialization already in progress, awaiting existing promise');
          return initializingPromise;
        }

        // Skip on web — @revenuecat/purchases-capacitor is a native-only plugin
        if (!Capacitor.isNativePlatform()) {
          console.info('RevenueCat: skipping initialization on web (native-only plugin)');
          set({
            isInitialized: true,
            billingAvailable: false,
            isLoading: false,
            hasActiveSubscription: false,
            lastInitializedUserId: userId || null,
          });
          return;
        }

        initializingPromise = (async () => {
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
        })();

        try {
          await initializingPromise;
        } finally {
          initializingPromise = null;
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
        // Do NOT persist hasActiveSubscription or customerInfo — they would
        // let an attacker grant themselves PRO by editing localStorage. PRO
        // status is always re-derived from RevenueCat / Supabase on init.
      }),
      version: 2,
      migrate: (persisted: any, fromVersion) => {
        // Drop any previously-persisted PRO flags from older versions
        if (persisted && typeof persisted === 'object') {
          delete persisted.hasActiveSubscription;
          delete persisted.customerInfo;
        }
        return persisted;
      },
    }
  )
);
