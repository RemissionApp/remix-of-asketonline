import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  Unlock, 
  RotateCcw, 
  Smartphone, 
  HardDrive, 
  Wifi, 
  Zap,
  Download,
  Trash2
} from 'lucide-react';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import { useAppStore } from '@/store/useAppStore';

export const AdvancedPWAControls: React.FC = () => {
  const {
    wakeLock,
    orientation,
    storage,
    badge,
    cache,
    persistentStorageGranted,
    wakeLockSupported,
    badgeCount
  } = usePWAFeatures();
  
  const { language } = useAppStore();

  const getTitle = () => {
    switch (language) {
      case 'ru': return 'Расширенные PWA функции';
      case 'es': return 'Funciones PWA avanzadas';
      default: return 'Advanced PWA Features';
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'ru': return 'Управление продвинутыми функциями приложения';
      case 'es': return 'Gestión de funciones avanzadas de la aplicación';
      default: return 'Manage advanced app features';
    }
  };

  const handleWakeLockToggle = async () => {
    const status = wakeLock.getStatus();
    if (status.active) {
      await wakeLock.release();
    } else {
      await wakeLock.start();
    }
  };

  const handleOrientationLock = async () => {
    const status = orientation.getStatus();
    if (status.locked) {
      await orientation.unlockOrientation();
    } else {
      await orientation.lockOrientation('portrait');
    }
  };

  const handleRequestPersistentStorage = async () => {
    await storage.request();
  };

  const handlePreloadResources = async () => {
    const criticalResources = [
      '/meditation/sounds/default.mp3',
      '/avatars/seeker.png',
      '/avatars/warrior.png',
      '/avatars/enlightened.png'
    ];
    await cache.preload(criticalResources);
  };

  const handleClearCache = async () => {
    await cache.clear();
  };

  const [cacheStats, setCacheStats] = React.useState<{
    size: number;
    entries: number;
    lastUpdated: Date;
  } | null>(null);

  React.useEffect(() => {
    const loadCacheStats = async () => {
      const stats = await cache.getStats();
      setCacheStats(stats);
    };
    loadCacheStats();
  }, [cache]);

  const formatSize = (bytes: number) => storage.formatSize(bytes);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {getTitle()}
        </CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Screen Wake Lock */}
        {wakeLockSupported && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {wakeLock.getStatus().active ? (
                  <Lock className="w-4 h-4 text-cosmic-accent" />
                ) : (
                  <Unlock className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="font-medium">
                  {language === 'ru' ? 'Блокировка экрана' : 
                   language === 'es' ? 'Bloqueo de pantalla' : 'Screen Wake Lock'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWakeLockToggle}
              >
                {wakeLock.getStatus().active ? 
                  (language === 'ru' ? 'Разблокировать' : 
                   language === 'es' ? 'Desbloquear' : 'Unlock') :
                  (language === 'ru' ? 'Заблокировать' : 
                   language === 'es' ? 'Bloquear' : 'Lock')
                }
              </Button>
            </div>
          </div>
        )}

        {/* Device Orientation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span className="font-medium">
                {language === 'ru' ? 'Ориентация устройства' : 
                 language === 'es' ? 'Orientación del dispositivo' : 'Device Orientation'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {orientation.getCurrentOrientation()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOrientationLock}
              >
                {orientation.getStatus().locked ? 
                  (language === 'ru' ? 'Разблокировать' : 
                   language === 'es' ? 'Desbloquear' : 'Unlock') :
                  (language === 'ru' ? 'Портрет' : 
                   language === 'es' ? 'Retrato' : 'Portrait')
                }
              </Button>
            </div>
          </div>
        </div>

        {/* Persistent Storage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              <span className="font-medium">
                {language === 'ru' ? 'Постоянное хранилище' : 
                 language === 'es' ? 'Almacenamiento persistente' : 'Persistent Storage'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={persistentStorageGranted ? "default" : "secondary"}>
                {persistentStorageGranted ? 
                  (language === 'ru' ? 'Предоставлено' : 
                   language === 'es' ? 'Concedido' : 'Granted') :
                  (language === 'ru' ? 'Не предоставлено' : 
                   language === 'es' ? 'No concedido' : 'Not Granted')
                }
              </Badge>
              {!persistentStorageGranted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestPersistentStorage}
                >
                  {language === 'ru' ? 'Запросить' : 
                   language === 'es' ? 'Solicitar' : 'Request'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Badge API */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="font-medium">
                {language === 'ru' ? 'Счетчик на иконке' : 
                 language === 'es' ? 'Contador en icono' : 'App Badge'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {badgeCount}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => badge.set(badgeCount + 1)}
              >
                +1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => badge.clear()}
              >
                {language === 'ru' ? 'Очистить' : 
                 language === 'es' ? 'Limpiar' : 'Clear'}
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Caching */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <span className="font-medium">
              {language === 'ru' ? 'Продвинутое кэширование' : 
               language === 'es' ? 'Caché avanzado' : 'Advanced Caching'}
            </span>
          </div>
          
          {cacheStats && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {language === 'ru' ? 'Записей:' : 
                   language === 'es' ? 'Entradas:' : 'Entries:'}
                </span>
                <span>{cacheStats.entries}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  {language === 'ru' ? 'Размер:' : 
                   language === 'es' ? 'Tamaño:' : 'Size:'}
                </span>
                <span>{formatSize(cacheStats.size)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  {language === 'ru' ? 'Обновлено:' : 
                   language === 'es' ? 'Actualizado:' : 'Updated:'}
                </span>
                <span>{cacheStats.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreloadResources}
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              {language === 'ru' ? 'Предзагрузка' : 
               language === 'es' ? 'Precargar' : 'Preload'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              {language === 'ru' ? 'Очистить' : 
               language === 'es' ? 'Limpiar' : 'Clear'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};