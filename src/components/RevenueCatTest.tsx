import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { revenueCatService } from '@/utils/revenueCat';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

export const RevenueCatTest: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    testRevenueCat();
  }, []);

  const testRevenueCat = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Тестирование RevenueCat...');

      // Инициализация
      await revenueCatService.initialize();
      setIsInitialized(true);

      const userInfo = await revenueCatService.getCustomerInfo();
      console.log('User Info:', JSON.stringify(userInfo, null, 2));

      // Получение предложений
      const offerings = await revenueCatService.getOfferings();
      console.log('Offerings:', offerings);

      // Получение информации о пользователе
      const customerInfo = await revenueCatService.getCustomerInfo();
      console.log('Customer Info:', customerInfo);

      toast({
        title: 'RevenueCat работает!',
        description: 'Система покупок успешно инициализирована',
      });
    } catch (err: any) {
      console.error('Ошибка тестирования RevenueCat:', err);
      setError(err.message || 'Неизвестная ошибка');

      toast({
        title: 'Ошибка RevenueCat',
        description: err.message || 'Не удалось инициализировать',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Тест RevenueCat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Статус:</span>
          <Badge variant={isInitialized ? 'default' : 'secondary'}>
            {isInitialized ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {isInitialized ? 'Работает' : 'Не работает'}
          </Badge>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">Ошибка: {error}</p>
          </div>
        )}

        <Button
          onClick={testRevenueCat}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Тестирование...' : 'Перетестировать'}
        </Button>
      </CardContent>
    </Card>
  );
};
