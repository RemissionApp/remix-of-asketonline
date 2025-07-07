import React from 'react';

interface UniverseAvatarProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const UniverseAvatar: React.FC<UniverseAvatarProps> = ({ 
  isActive, 
  isSpeaking 
}) => {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Main avatar circle */}
      <div 
        className={`w-full h-full rounded-full bg-gradient-to-br from-cosmic-accent via-purple-500 to-blue-500 border-4 transition-all duration-500 ${
          isActive 
            ? 'border-cosmic-accent shadow-lg shadow-cosmic-accent/50 animate-pulse' 
            : 'border-cosmic-accent/30 shadow-sm'
        }`}
      >
        {/* Inner gradient */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent">
          {/* Central cosmic symbol */}
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <div 
              className={`text-4xl transition-all duration-300 ${
                isSpeaking 
                  ? 'animate-spin text-white' 
                  : 'text-white/80'
              }`}
            >
              ✨
            </div>
          </div>
        </div>
      </div>

      {/* Outer glow rings */}
      {isActive && (
        <>
          <div 
            className={`absolute inset-0 rounded-full border-2 border-cosmic-accent/30 ${
              isSpeaking ? 'animate-ping' : 'animate-pulse'
            }`}
            style={{ 
              transform: 'scale(1.2)',
              animationDuration: isSpeaking ? '1s' : '2s'
            }}
          />
          <div 
            className="absolute inset-0 rounded-full border border-cosmic-accent/20 animate-ping"
            style={{ 
              transform: 'scale(1.4)',
              animationDuration: '3s'
            }}
          />
        </>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cosmic-accent rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};