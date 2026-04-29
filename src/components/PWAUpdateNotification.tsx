import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PWAUpdateManager } from '@/utils/pwaUpdateManager';
import { isPwaDisabledEnvironment } from '@/utils/pwaUtils';

export const PWAUpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateManager, setUpdateManager] = useState<PWAUpdateManager | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isPwaDisabledEnvironment()) {
      return;
    }
    const handleUpdateAvailable = (event: CustomEvent) => {
      setUpdateManager(event.detail.updateManager);
      setShowUpdate(true);
    };

    window.addEventListener(
      'pwa-update-available',
      handleUpdateAvailable as EventListener
    );

    return () => {
      window.removeEventListener(
        'pwa-update-available',
        handleUpdateAvailable as EventListener
      );
    };
  }, []);

  const handleUpdate = async () => {
    if (updateManager) {
      setIsUpdating(true);
      const success = await updateManager.applyUpdate();

      if (!success) {
        setIsUpdating(false);
        setShowUpdate(false);
      }
      // Если успешно, страница перезагрузится автоматически
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-cosmic-dark/95 backdrop-blur-sm border-cosmic-gold/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <RefreshCw
                className={`text-cosmic-gold w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`}
              />
              <h3 className="text-cosmic-light font-medium">
                Обновление доступно
              </h3>
            </div>
            {!isUpdating && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-cosmic-muted hover:text-cosmic-light"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <p className="text-cosmic-muted text-sm mb-4">
            Доступна новая версия приложения с улучшениями и исправлениями
          </p>

          <div className="flex space-x-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 disabled:opacity-50"
              size="sm"
            >
              {isUpdating ? 'Обновляется...' : 'Обновить'}
            </Button>
            {!isUpdating && (
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="border-cosmic-gold/20 text-cosmic-muted hover:text-cosmic-light"
              >
                Позже
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
