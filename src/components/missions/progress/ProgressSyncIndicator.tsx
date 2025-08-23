import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

interface ProgressSyncIndicatorProps {
  isOnline?: boolean;
  syncStatus: 'syncing' | 'synced' | 'error' | 'offline';
  lastSyncTime?: Date;
}

export const ProgressSyncIndicator: React.FC<ProgressSyncIndicatorProps> = ({
  isOnline = navigator.onLine,
  syncStatus,
  lastSyncTime,
}) => {
  const { language } = useAppStore();

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'synced':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'offline':
        return <WifiOff className="w-3 h-3 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return language === 'ru' 
          ? 'Синхронизация...' 
          : language === 'es' 
            ? 'Sincronizando...' 
            : 'Syncing...';
      case 'synced':
        return language === 'ru' 
          ? 'Синхронизировано' 
          : language === 'es' 
            ? 'Sincronizado' 
            : 'Synced';
      case 'error':
        return language === 'ru' 
          ? 'Ошибка синхронизации' 
          : language === 'es' 
            ? 'Error de sincronización' 
            : 'Sync error';
      case 'offline':
        return language === 'ru' 
          ? 'Оффлайн режим' 
          : language === 'es' 
            ? 'Modo sin conexión' 
            : 'Offline mode';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-blue-400';
      case 'synced':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'offline':
        return 'text-yellow-500';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className="flex items-center space-x-1">
        {isOnline ? (
          <Wifi className="w-3 h-3 text-cosmic-gold" />
        ) : (
          <WifiOff className="w-3 h-3 text-yellow-500" />
        )}
      </div>
      
      <div className="flex items-center space-x-1">
        {getStatusIcon()}
        <span className={cn('text-xs', getStatusColor())}>
          {getStatusText()}
        </span>
      </div>

      {lastSyncTime && syncStatus === 'synced' && (
        <span className="text-cosmic-secondary">
          {lastSyncTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};