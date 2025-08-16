import React from 'react';

interface CallStatusProps {
  isConnected: boolean;
  duration: string;
  isListening: boolean;
  isSpeaking: boolean;
}

export const CallStatus: React.FC<CallStatusProps> = ({
  isConnected,
  duration,
  isListening,
  isSpeaking,
}) => {
  const getStatusText = () => {
    if (!isConnected) {
      return 'Готов к соединению';
    }

    if (isSpeaking) {
      return 'Вселенная говорит...';
    }

    if (isListening) {
      return 'Вселенная слушает...';
    }

    return 'На связи';
  };

  const getStatusColor = () => {
    if (!isConnected) return 'text-cosmic-muted';
    if (isSpeaking) return 'text-green-400';
    if (isListening) return 'text-blue-400';
    return 'text-cosmic-accent';
  };

  return (
    <div className="space-y-2">
      {/* Status indicator */}
      <div className="flex items-center justify-center gap-2">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
          }`}
        />
        <span
          className={`text-sm font-medium transition-colors duration-300 ${getStatusColor()}`}
        >
          {getStatusText()}
        </span>
      </div>

      {/* Call duration */}
      {isConnected && (
        <div className="text-lg font-mono text-white">{duration}</div>
      )}

      {/* Activity indicators */}
      {isConnected && (
        <div className="flex justify-center gap-4 text-xs">
          <div
            className={`flex items-center gap-1 transition-opacity duration-300 ${
              isSpeaking ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">Говорит</span>
          </div>

          <div
            className={`flex items-center gap-1 transition-opacity duration-300 ${
              isListening ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400">Слушает</span>
          </div>
        </div>
      )}
    </div>
  );
};
