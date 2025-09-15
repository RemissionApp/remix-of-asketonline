import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useAppStore } from '@/store/useAppStore';
import { ShoppingCart, Package, AlertCircle, CheckCircle } from 'lucide-react';

export const OfferingsDisplay: React.FC = () => {
  const { user } = useAppStore();
  const {
    hasActiveSubscription,
    isInitialized,
    offerings,
    isLoading,
    purchasePackage,
    billingAvailable,
  } = useRevenueCat(user?.id);

  const handlePurchase = async (packageToPurchase: any) => {
    try {
      await purchasePackage(packageToPurchase);
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  if (!isInitialized) {
    return (
      <Card className="w-full max-w-lg mx-auto mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Офферы RevenueCat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Инициализация...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (billingAvailable === false) {
    return (
      <Card className="w-full max-w-lg mx-auto mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Google Play Billing недоступен
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Для тестирования покупок используйте реальное устройство с Google
            Play Store
          </div>
        </CardContent>
      </Card>
    );
  }

  if (offerings.length === 0) {
    return (
      <Card className="w-full max-w-lg mx-auto mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Офферы RevenueCat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p>Нет доступных офферов</p>
            <p className="text-sm mt-1">
              Убедитесь, что в RevenueCat Dashboard создан Offering и связан с
              продуктом
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentOffering = offerings[0];

  return (
    <Card className="w-full max-w-lg mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Офферы RevenueCat
        </CardTitle>
        <CardDescription>Доступные предложения для покупки</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статус подписки */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Статус подписки:</span>
          <Badge variant={hasActiveSubscription ? 'default' : 'outline'}>
            {hasActiveSubscription ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {hasActiveSubscription ? 'Активна' : 'Неактивна'}
          </Badge>
        </div>

        {/* Информация об оффере */}
        <div className="space-y-2">
          <h4 className="font-medium">Текущий оффер:</h4>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium">{currentOffering.identifier}</p>
            <p className="text-xs text-muted-foreground">
              Доступно пакетов: {currentOffering.availablePackages.length}
            </p>
          </div>
        </div>

        {/* Доступные пакеты */}
        {currentOffering.availablePackages.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Доступные пакеты:</h4>
            {currentOffering.availablePackages.map((pkg, index) => (
              <div key={index} className="p-3 border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{pkg.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {pkg.product.description}
                    </p>
                  </div>
                  <Badge variant="outline">{pkg.product.priceString}</Badge>
                </div>

                {!hasActiveSubscription && (
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    disabled={isLoading}
                    className="w-full"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isLoading ? 'Обработка...' : 'Купить'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Отладочная информация */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
            Отладочная информация
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(
                {
                  offeringId: currentOffering.identifier,
                  packagesCount: currentOffering.availablePackages.length,
                  packages: currentOffering.availablePackages.map(pkg => ({
                    identifier: pkg.identifier,
                    productId: pkg.product.identifier,
                    title: pkg.product.title,
                    price: pkg.product.priceString,
                  })),
                },
                null,
                2
              )}
            </pre>
          </div>
        </details>
      </CardContent>
    </Card>
  );
};
