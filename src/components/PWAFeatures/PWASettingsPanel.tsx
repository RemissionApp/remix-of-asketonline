import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vibrate, Bell, Wifi, WifiOff, Download, Trash2 } from 'lucide-react';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import { useAppStore } from '@/store/useAppStore';
import { AdvancedPWAControls } from './AdvancedPWAControls';

export const PWASettingsPanel: React.FC = () => {
  const {
    isInitialized,
    hapticEnabled,
    notificationsEnabled,
    backgroundSyncStatus,
    toggleHaptic,
    sync
  } = usePWAFeatures();
  const { language } = useAppStore();

  const getTitle = () => {
    switch (language) {
      case 'ru': return 'Настройки приложения';
      case 'es': return 'Configuración de la aplicación';
      default: return 'App Settings';
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'ru': return 'Управление функциями приложения';
      case 'es': return 'Gestionar características de la aplicación';
      default: return 'Manage app features';
    }
  };

  const getHapticTitle = () => {
    switch (language) {
      case 'ru': return 'Тактильная обратная связь';
      case 'es': return 'Retroalimentación táctil';
      default: return 'Haptic Feedback';
    }
  };

  const getHapticDescription = () => {
    switch (language) {
      case 'ru': return 'Вибрация при взаимодействии с приложением';
      case 'es': return 'Vibración al interactuar con la aplicación';
      default: return 'Vibration when interacting with the app';
    }
  };

  const getNotificationsTitle = () => {
    switch (language) {
      case 'ru': return 'Уведомления';
      case 'es': return 'Notificaciones';
      default: return 'Notifications';
    }
  };

  const getNotificationsDescription = () => {
    switch (language) {
      case 'ru': return 'Push-уведомления о событиях приложения';
      case 'es': return 'Notificaciones push sobre eventos de la aplicación';
      default: return 'Push notifications about app events';
    }
  };

  const getSyncTitle = () => {
    switch (language) {
      case 'ru': return 'Фоновая синхронизация';
      case 'es': return 'Sincronización en segundo plano';
      default: return 'Background Sync';
    }
  };

  const getSyncDescription = () => {
    switch (language) {
      case 'ru': return 'Синхронизация данных в фоновом режиме';
      case 'es': return 'Sincronización de datos en segundo plano';
      default: return 'Background data synchronization';
    }
  };

  const getOnlineText = () => {
    switch (language) {
      case 'ru': return 'Онлайн';
      case 'es': return 'En línea';
      default: return 'Online';
    }
  };

  const getOfflineText = () => {
    switch (language) {
      case 'ru': return 'Офлайн';
      case 'es': return 'Fuera de línea';
      default: return 'Offline';
    }
  };

  const getPendingTasksText = () => {
    const count = backgroundSyncStatus.pendingCount;
    switch (language) {
      case 'ru': return `Отложенных задач: ${count}`;
      case 'es': return `Tareas pendientes: ${count}`;
      default: return `Pending tasks: ${count}`;
    }
  };

  const getClearTasksText = () => {
    switch (language) {
      case 'ru': return 'Очистить задачи';
      case 'es': return 'Limpiar tareas';
      default: return 'Clear tasks';
    }
  };

  const getSupportedText = () => {
    switch (language) {
      case 'ru': return 'Поддерживается';
      case 'es': return 'Compatible';
      default: return 'Supported';
    }
  };

  const getNotSupportedText = () => {
    switch (language) {
      case 'ru': return 'Не поддерживается';
      case 'es': return 'No compatible';
      default: return 'Not supported';
    }
  };

  if (!isInitialized) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-accent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5 mb-8">
      <h3 className="text-white font-medium mb-3 font-sans flex items-center gap-2 text-sm">
        <Download className="w-4 h-4" />
        {getTitle()}
      </h3>
      <div className="space-y-6">
        {/* Haptic Feedback */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Vibrate className="w-3 h-3" />
              <span className="text-xs font-medium">{getHapticTitle()}</span>
            </div>
            <p className="text-xs text-muted-foreground">{getHapticDescription()}</p>
          </div>
          <Switch
            checked={hapticEnabled}
            onCheckedChange={toggleHaptic}
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Bell className="w-3 h-3" />
              <span className="text-xs font-medium">{getNotificationsTitle()}</span>
              <Badge variant={notificationsEnabled ? "default" : "secondary"} className="text-xs px-1 py-0">
                {notificationsEnabled ? getSupportedText() : getNotSupportedText()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{getNotificationsDescription()}</p>
          </div>
        </div>

        {/* Background Sync */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {backgroundSyncStatus.isOnline ? (
                  <Wifi className="w-3 h-3 text-green-500" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
                <span className="text-xs font-medium">{getSyncTitle()}</span>
                <Badge variant={backgroundSyncStatus.isSupported ? "default" : "secondary"} className="text-xs px-1 py-0">
                  {backgroundSyncStatus.isSupported ? getSupportedText() : getNotSupportedText()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{getSyncDescription()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {backgroundSyncStatus.isOnline ? getOnlineText() : getOfflineText()}
            </span>
            <span className="text-muted-foreground">
              {getPendingTasksText()}
            </span>
          </div>

          {backgroundSyncStatus.pendingCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => sync.clearPendingTasks()}
              className="w-full border border-cosmic-accent/30 hover:bg-cosmic-accent/20 text-cosmic-secondary hover:text-white text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              {getClearTasksText()}
            </Button>
          )}
        </div>
      </div>
      
      {/* Расширенные PWA функции */}
      <div className="mt-4">
        <AdvancedPWAControls />
      </div>
    </div>
  );
};