import React, { useEffect, useState } from 'react';
import { revenueCatService } from '../utils/revenueCat';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';

interface Package {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    title: string;
    description: string;
    price: number;
    priceString: string;
  };
}

interface Offering {
  identifier: string;
  serverDescription: string;
  availablePackages: Package[];
}

export const SubscriptionManager: React.FC = () => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<any>(null);

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      setLoading(true);
      await revenueCatService.initialize();

      // Получаем информацию о пользователе
      const customer = await revenueCatService.getCustomerInfo();
      setCustomerInfo(customer);

      // Получаем предложения подписок
      const offeringsData = await revenueCatService.getOfferings();
      if (offeringsData.current) {
        setOfferings([offeringsData.current]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to initialize RevenueCat'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageToPurchase: Package) => {
    try {
      setLoading(true);
      const customerInfo =
        await revenueCatService.purchasePackage(packageToPurchase);
      setCustomerInfo(customerInfo);
      alert('Purchase successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      const customerInfo = await revenueCatService.restorePurchases();
      setCustomerInfo(customerInfo);
      alert('Purchases restored successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore failed');
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = customerInfo?.entitlements?.active?.premium;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading subscriptions...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
          <Button onClick={initializeRevenueCat} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статус подписки */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubscribed ? (
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">
                Premium Active
              </Badge>
              <span>You have an active premium subscription!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Free Plan</Badge>
              <span>Upgrade to premium for full access</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Предложения подписок */}
      {offerings.map(offering => (
        <Card key={offering.identifier}>
          <CardHeader>
            <CardTitle>
              {offering.serverDescription || 'Premium Plans'}
            </CardTitle>
            <CardDescription>
              Choose the plan that works best for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offering.availablePackages.map(pkg => (
                <Card key={pkg.identifier} className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{pkg.product.title}</h3>
                    <p className="text-sm text-gray-600">
                      {pkg.product.description}
                    </p>
                    <div className="text-2xl font-bold">
                      {pkg.product.priceString}
                    </div>
                    <Button
                      onClick={() => handlePurchase(pkg)}
                      disabled={loading || isSubscribed}
                      className="w-full"
                    >
                      {isSubscribed ? 'Already Subscribed' : 'Subscribe'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Кнопка восстановления покупок */}
      <Card>
        <CardContent className="p-6">
          <Button onClick={handleRestore} disabled={loading} variant="outline">
            Restore Purchases
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


