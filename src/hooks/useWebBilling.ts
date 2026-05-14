import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { isWebPlatform } from '@/utils/platform';
import {
  configureRevenueCatWeb,
  getWebOfferings,
  getWebCustomerInfo,
  purchaseWebPackage,
  hasActiveProEntitlement,
  type Offering,
  type Package,
  type CustomerInfo,
} from '@/utils/revenueCatWeb';
import { toast } from 'sonner';

/**
 * Web-only RevenueCat hook. Initializes the Web Billing SDK with the current
 * authenticated user, exposes the current offering, and runs purchases through
 * RevenueCat's hosted Stripe checkout. Native platforms should keep using
 * `useRevenueCat` (Capacitor SDK).
 */
export function useWebBilling() {
  const { user, updateProStatus } = useAppStore();
  const enabled = isWebPlatform() && !!user?.id;

  const [offering, setOffering] = useState<Offering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Configure SDK + fetch initial data when user becomes available
  useEffect(() => {
    if (!enabled || !user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        configureRevenueCatWeb(user.id);
        const [off, info] = await Promise.all([
          getWebOfferings(),
          getWebCustomerInfo().catch(() => null),
        ]);
        if (cancelled) return;
        setOffering(off);
        setCustomerInfo(info);
        if (info) updateProStatus(hasActiveProEntitlement(info));
        setIsReady(true);
      } catch (e) {
        console.error('[WebBilling] init failed', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, user?.id, updateProStatus]);

  const purchase = useCallback(
    async (pkg: Package) => {
      if (!enabled) return;
      try {
        setIsPurchasing(true);
        const info = await purchaseWebPackage(pkg, user?.email);
        setCustomerInfo(info);
        const isPro = hasActiveProEntitlement(info);
        updateProStatus(isPro);
        if (isPro) {
          toast.success('PRO активирован', {
            description: 'Все премиум-функции открыты.',
          });
        }
      } catch (e: any) {
        if (e?.errorCode === 'UserCancelledError' || e?.userCancelled) {
          toast.message('Покупка отменена');
        } else {
          console.error('[WebBilling] purchase failed', e);
          toast.error('Ошибка оплаты', {
            description: e?.message ?? 'Попробуйте ещё раз',
          });
        }
      } finally {
        setIsPurchasing(false);
      }
    },
    [enabled, user?.email, updateProStatus]
  );

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const info = await getWebCustomerInfo();
      setCustomerInfo(info);
      updateProStatus(hasActiveProEntitlement(info));
    } catch (e) {
      console.warn('[WebBilling] refresh failed', e);
    }
  }, [enabled, updateProStatus]);

  return {
    enabled,
    isReady,
    isLoading,
    isPurchasing,
    offering,
    customerInfo,
    isPro: hasActiveProEntitlement(customerInfo),
    purchase,
    refresh,
  };
}