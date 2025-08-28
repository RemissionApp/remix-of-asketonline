import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useToast } from '@/hooks/use-toast';
import { Crown, TestTube, CheckCircle, XCircle } from 'lucide-react';

export const PaywallTest: React.FC = () => {
  const {
    presentPaywall,
    isLoading,
    hasActiveSubscription,
    billingAvailable,
    isInitialized,
  } = useRevenueCat();
  const { toast } = useToast();

  const handleTestPaywall = async () => {
    try {
      console.log('Testing RevenueCat Paywall...');

      // Проверяем доступность плагинов
      console.log('Checking plugin availability...');

      // Проверяем RevenueCatUI
      if (typeof window !== 'undefined') {
        console.log(
          'window.RevenueCatUI:',
          (window as unknown as Record<string, unknown>).RevenueCatUI
        );
        console.log(
          'window.Purchases:',
          (window as unknown as Record<string, unknown>).Purchases
        );
      }

      await presentPaywall();
    } catch (error) {
      console.error('Paywall test error:', error);
      toast({
        title: 'Ошибка тестирования',
        description: 'Не удалось открыть Paywall',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Тест RevenueCat Paywall
        </CardTitle>
        <CardDescription>
          Проверка интеграции с RevenueCat Paywalls согласно документации
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              RevenueCat инициализирован:
            </span>
            <div className="flex items-center gap-2">
              {getStatusIcon(isInitialized)}
              <span
                className={`text-sm ${isInitialized ? 'text-green-600' : 'text-red-600'}`}
              >
                {isInitialized ? 'Да' : 'Нет'}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Статус подписки:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(hasActiveSubscription)}
              <span
                className={`text-sm ${hasActiveSubscription ? 'text-green-600' : 'text-red-600'}`}
              >
                {hasActiveSubscription ? 'Активна' : 'Неактивна'}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Google Play Billing:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(billingAvailable || false)}
              <span
                className={`text-sm ${billingAvailable ? 'text-green-600' : 'text-red-600'}`}
              >
                {billingAvailable ? 'Доступен' : 'Недоступен'}
              </span>
            </div>
          </div>
        </div>

        {hasActiveSubscription ? (
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Crown className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-300">
              У вас активна премиум подписка!
            </p>
          </div>
        ) : (
          <Button
            onClick={handleTestPaywall}
            disabled={isLoading || !billingAvailable || !isInitialized}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? 'Загрузка...' : 'Тестировать Paywall'}
          </Button>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>✅ Установлен @revenuecat/purchases-capacitor-ui</p>
          <p>✅ Версии пакетов совпадают</p>
          <p>✅ Используется RevenueCatUI.presentPaywall()</p>
          <p>✅ minSdkVersion увеличен до 24</p>
          <p>⚠️ Убедитесь, что Paywall настроен в RevenueCat Dashboard</p>
        </div>
      </CardContent>
    </Card>
  );
};
