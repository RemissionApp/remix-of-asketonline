import React from 'react';
import { useAppStore } from '@/store/useAppStore';

interface CallStatusIndicatorProps {
  isConnected: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export const CallStatusIndicator: React.FC<CallStatusIndicatorProps> = ({
  isConnected,
  isLoading = false,
  error = null
}) => {
  const { language } = useAppStore();

  const getStatusText = () => {
    if (error) {
      switch (language) {
        case 'ru': return 'Ошибка соединения';
        case 'es': return 'Error de conexión';
        default: return 'Connection error';
      }
    }
    
    if (isLoading) {
      switch (language) {
        case 'ru': return 'Соединение...';
        case 'es': return 'Conectando...';
        default: return 'Connecting...';
      }
    }
    
    if (isConnected) {
      switch (language) {
        case 'ru': return 'Соединение активно';
        case 'es': return 'Conexión activa';
        default: return 'Connected';
      }
    }
    
    switch (language) {
      case 'ru': return 'Готов к звонку';
      case 'es': return 'Listo para llamar';
      default: return 'Ready to call';
    }
  };

  const getStatusColor = () => {
    if (error) return 'text-red-400';
    if (isLoading) return 'text-yellow-400';
    if (isConnected) return 'text-green-400';
    return 'text-cosmic-secondary';
  };

  const getIndicatorColor = () => {
    if (error) return 'bg-red-500';
    if (isLoading) return 'bg-yellow-500 animate-pulse';
    if (isConnected) return 'bg-green-500 animate-pulse';
    return 'bg-cosmic-secondary';
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-2">
      <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
};