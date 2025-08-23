import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { ShoppingCart, RefreshCw, Crown, AlertCircle } from 'lucide-react';

export const PurchaseTestButton: React.FC = () => {
  const {
    isInitialized,
    offerings,
    customerInfo,
    isLoading,
    purchasePackage,
    restorePurchases,
  } = useRevenueCat();

  const handlePurchase = async (packageToPurchase: any) => {
    try {
      await purchasePackage(packageToPurchase);
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
    } catch (error) {
      console.error('Restore error:', error);
    }
  };

  // Проверяем, есть ли активная подписка
  const hasActiveSubscription =
    customerInfo?.entitlements.active['asket_premium_montly'];

  return (
    <Card className="w-full max-w-lg mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Тест покупок Google Play
        </CardTitle>
        <CardDescription>
          Тестирование интеграции с RevenueCat и Google Play Billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статус инициализации */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Статус RevenueCat:</span>
          <Badge variant={isInitialized ? 'default' : 'secondary'}>
            {isInitialized ? 'Готов' : 'Инициализация...'}
          </Badge>
        </div>

        {/* Статус подписки */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Подписка Premium:</span>
          <Badge variant={hasActiveSubscription ? 'default' : 'outline'}>
            {hasActiveSubscription ? 'Активна' : 'Неактивна'}
          </Badge>
        </div>

        {/* Предупреждение о настройке API ключа */}
        {!isInitialized && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Убедитесь, что API ключ RevenueCat настроен в revenueCat.ts
            </span>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="space-y-2">
          {offerings.length > 0 && offerings[0].availablePackages.length > 0 ? (
            offerings[0].availablePackages.map((pkg, index) => (
              <Button
                key={index}
                onClick={() => handlePurchase(pkg)}
                disabled={isLoading || !isInitialized}
                className="w-full"
                variant="default"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Купить {pkg.product.title} - {pkg.product.priceString}
              </Button>
            ))
          ) : (
            <Button disabled className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Нет доступных предложений
            </Button>
          )}

          <Button
            onClick={handleRestore}
            disabled={isLoading || !isInitialized}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Восстановить покупки
          </Button>
        </div>

        {/* Информация о продукте */}
        {offerings.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <p>Доступные продукты:</p>
            <ul className="list-disc list-inside mt-1">
              {offerings[0].availablePackages.map((pkg, index) => (
                <li key={index}>
                  {pkg.product.title} - {pkg.product.priceString}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
