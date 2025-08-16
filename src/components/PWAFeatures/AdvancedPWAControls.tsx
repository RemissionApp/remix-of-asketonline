import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Trash2,
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
    badgeCount,
  } = usePWAFeatures();

  const { language } = useAppStore();

  const getTitle = () => {
    switch (language) {
      case 'ru':
        return 'Расширенные функции приложения';
      case 'es':
        return 'Funciones avanzadas de la aplicación';
      default:
        return 'Advanced App Features';
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'ru':
        return 'Управление продвинутыми функциями приложения';
      case 'es':
        return 'Gestión de funciones avanzadas de la aplicación';
      default:
        return 'Manage advanced app features';
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
      '/avatars/enlightened.png',
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
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5">
      <h3 className="text-white font-medium mb-3 font-sans flex items-center gap-2 text-sm">
        <Zap className="w-4 h-4" />
        {getTitle()}
      </h3>

      <div className="space-y-6">
        {/* Screen Wake Lock */}
        {wakeLockSupported && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {wakeLock.getStatus().active ? (
                  <Lock className="w-3 h-3 text-cosmic-accent" />
                ) : (
                  <Unlock className="w-3 h-3 text-muted-foreground" />
                )}
                <span className="font-medium text-xs">
                  {language === 'ru'
                    ? 'Блокировка экрана'
                    : language === 'es'
                      ? 'Bloqueo de pantalla'
                      : 'Screen Wake Lock'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWakeLockToggle}
                className="border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
              >
                {wakeLock.getStatus().active
                  ? language === 'ru'
                    ? 'Разблокировать'
                    : language === 'es'
                      ? 'Desbloquear'
                      : 'Unlock'
                  : language === 'ru'
                    ? 'Заблокировать'
                    : language === 'es'
                      ? 'Bloquear'
                      : 'Lock'}
              </Button>
            </div>
          </div>
        )}

        {/* Device Orientation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3 h-3" />
              <span className="font-medium text-xs">
                {language === 'ru'
                  ? 'Ориентация устройства'
                  : language === 'es'
                    ? 'Orientación del dispositivo'
                    : 'Device Orientation'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {orientation.getCurrentOrientation()}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOrientationLock}
                className="border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
              >
                {orientation.getStatus().locked
                  ? language === 'ru'
                    ? 'Разблокировать'
                    : language === 'es'
                      ? 'Desbloquear'
                      : 'Unlock'
                  : language === 'ru'
                    ? 'Портрет'
                    : language === 'es'
                      ? 'Retrato'
                      : 'Portrait'}
              </Button>
            </div>
          </div>
        </div>

        {/* Persistent Storage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-3 h-3" />
              <span className="font-medium text-xs">
                {language === 'ru'
                  ? 'Постоянное хранилище'
                  : language === 'es'
                    ? 'Almacenamiento persistente'
                    : 'Persistent Storage'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={persistentStorageGranted ? 'default' : 'secondary'}
                className="text-xs px-1 py-0"
              >
                {persistentStorageGranted
                  ? language === 'ru'
                    ? 'Предоставлено'
                    : language === 'es'
                      ? 'Concedido'
                      : 'Granted'
                  : language === 'ru'
                    ? 'Не предоставлено'
                    : language === 'es'
                      ? 'No concedido'
                      : 'Not Granted'}
              </Badge>
              {!persistentStorageGranted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRequestPersistentStorage}
                  className="border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
                >
                  {language === 'ru'
                    ? 'Запросить'
                    : language === 'es'
                      ? 'Solicitar'
                      : 'Request'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Badge API */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-3 h-3" />
              <span className="font-medium text-xs">
                {language === 'ru'
                  ? 'Счетчик на иконке'
                  : language === 'es'
                    ? 'Contador en icono'
                    : 'App Badge'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {badgeCount}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => badge.set(badgeCount + 1)}
                className="border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
              >
                +1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => badge.clear()}
                className="border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
              >
                {language === 'ru'
                  ? 'Очистить'
                  : language === 'es'
                    ? 'Limpiar'
                    : 'Clear'}
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Caching */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            <span className="font-medium text-xs">
              {language === 'ru'
                ? 'Продвинутое кэширование'
                : language === 'es'
                  ? 'Caché avanzado'
                  : 'Advanced Caching'}
            </span>
          </div>

          {cacheStats && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>
                  {language === 'ru'
                    ? 'Записей:'
                    : language === 'es'
                      ? 'Entradas:'
                      : 'Entries:'}
                </span>
                <span>{cacheStats.entries}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>
                  {language === 'ru'
                    ? 'Размер:'
                    : language === 'es'
                      ? 'Tamaño:'
                      : 'Size:'}
                </span>
                <span>{formatSize(cacheStats.size)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>
                  {language === 'ru'
                    ? 'Обновлено:'
                    : language === 'es'
                      ? 'Actualizado:'
                      : 'Updated:'}
                </span>
                <span>{cacheStats.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreloadResources}
              className="flex items-center gap-1 border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
            >
              <Download className="w-3 h-3" />
              {language === 'ru'
                ? 'Предзагрузка'
                : language === 'es'
                  ? 'Precargar'
                  : 'Preload'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCache}
              className="flex items-center gap-1 border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
            >
              <Trash2 className="w-3 h-3" />
              {language === 'ru'
                ? 'Очистить'
                : language === 'es'
                  ? 'Limpiar'
                  : 'Clear'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
