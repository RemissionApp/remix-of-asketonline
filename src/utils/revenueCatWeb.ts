import {
  Purchases,
  type Offering,
  type Package,
  type CustomerInfo,
  LogLevel,
} from '@revenuecat/purchases-js';

/**
 * Public Web Billing API key (sandbox). Safe to ship in frontend bundle —
 * RevenueCat documents this key as a publishable client identifier.
 * Swap for the live `rcb_live_...` key before production launch.
 */
const REVENUECAT_WEB_BILLING_KEY = 'rcb_sb_PSGMubKlZchuQEFDledwImmYf';

let configuredFor: string | null = null;

/**
 * Configure (or reconfigure) the Web Billing SDK for the given user.
 * Idempotent per `appUserId` — calling with the same id is a no-op.
 */
export function configureRevenueCatWeb(appUserId: string): Purchases {
  if (Purchases.isConfigured() && configuredFor === appUserId) {
    return Purchases.getSharedInstance();
  }
  if (import.meta.env.DEV) {
    Purchases.setLogLevel(LogLevel.Debug);
  }
  const instance = Purchases.configure({
    apiKey: REVENUECAT_WEB_BILLING_KEY,
    appUserId,
  });
  configuredFor = appUserId;
  return instance;
}

export async function getWebOfferings(): Promise<Offering | null> {
  const offerings = await Purchases.getSharedInstance().getOfferings();
  return offerings.current ?? offerings.all?.['default'] ?? null;
}

export async function purchaseWebPackage(
  rcPackage: Package,
  customerEmail?: string
): Promise<CustomerInfo> {
  const result = await Purchases.getSharedInstance().purchase({
    rcPackage,
    customerEmail,
  });
  return result.customerInfo;
}

export async function getWebCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getSharedInstance().getCustomerInfo();
}

export function hasActiveProEntitlement(info: CustomerInfo | null): boolean {
  if (!info) return false;
  const active = info.entitlements?.active ?? {};
  return Object.keys(active).length > 0;
}

export type { Offering, Package, CustomerInfo };