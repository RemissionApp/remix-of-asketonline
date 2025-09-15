import React from 'react';
import { useRevenueCatStore } from '@/store/slices/revenueCatSlice';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

export const SubscriptionManager: React.FC = () => {
  const { toast } = useToast();
  const {
    isInitialized,
    isLoading,
    offerings,
    customerInfo,
    hasActiveSubscription,
    purchasePackage,
    restorePurchases,
    initialize,
  } = useRevenueCatStore();

  const handlePurchase = async (packageToPurchase: any) => {
    try {
      await purchasePackage(packageToPurchase);
      toast({
        title: 'Покупка успешна!',
        description: 'Спасибо за покупку!',
      });
    } catch (err) {
      console.error('Purchase failed:', err);
      toast({
        title: 'Ошибка покупки',
        description:
          err instanceof Error ? err.message : 'Не удалось совершить покупку',
        variant: 'destructive',
      });
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      toast({
        title: 'Покупки восстановлены',
        description: 'Ваши покупки успешно восстановлены',
      });
    } catch (err) {
      console.error('Restore failed:', err);
      toast({
        title: 'Ошибка восстановления',
        description:
          err instanceof Error
            ? err.message
            : 'Не удалось восстановить покупки',
        variant: 'destructive',
      });
    }
  };

  const handleInitialize = async () => {
    try {
      await initialize();
    } catch (err) {
      console.error('Initialize failed:', err);
      toast({
        title: 'Ошибка инициализации',
        description:
          err instanceof Error ? err.message : 'Не удалось инициализировать',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading subscriptions...</div>
        </CardContent>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="mb-4">RevenueCat не инициализирован</p>
            <Button onClick={handleInitialize}>Инициализировать</Button>
          </div>
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
          {hasActiveSubscription ? (
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
                      disabled={isLoading || hasActiveSubscription}
                      className="w-full"
                    >
                      {hasActiveSubscription
                        ? 'Already Subscribed'
                        : 'Subscribe'}
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
          <Button
            onClick={handleRestore}
            disabled={isLoading}
            variant="outline"
          >
            Restore Purchases
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
