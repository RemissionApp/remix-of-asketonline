import React from 'react';
import { useAppStore } from '@/store/useAppStore';

interface CallStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
  duration: string;
}

const labels = {
  ru: { idle: 'Готов к соединению', connecting: 'Соединение со Вселенной…', live: 'На связи' },
  en: { idle: 'Ready to connect', connecting: 'Connecting to the Universe…', live: 'Connected' },
  es: { idle: 'Listo para conectar', connecting: 'Conectando con el Universo…', live: 'En línea' },
};

export const CallStatus: React.FC<CallStatusProps> = ({
  isConnected,
  isConnecting,
  duration,
}) => {
  const { language } = useAppStore();
  const t = labels[language as keyof typeof labels] ?? labels.en;

  const text = isConnected
    ? `${t.live} · ${duration}`
    : isConnecting
      ? t.connecting
      : t.idle;

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isConnected
            ? 'bg-green-400 animate-pulse'
            : isConnecting
              ? 'bg-yellow-400 animate-pulse'
              : 'bg-gray-500'
        }`}
      />
      <span className="text-sm font-medium text-white/90 font-mono">{text}</span>
    </div>
  );
};
