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
        className={`w-full h-full rounded-full border-4 transition-all duration-500 relative overflow-hidden ${
          isActive 
            ? 'border-cosmic-accent shadow-lg shadow-cosmic-accent/50 animate-pulse' 
            : 'border-cosmic-accent/30 shadow-sm'
        }`}
      >
        {/* Universe Avatar Image */}
        <img 
          src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png"
          alt="Universe Avatar"
          className="w-full h-full object-cover rounded-full"
        />
        
        {/* Twinkling stars overlay */}
        <div className="absolute inset-0 rounded-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white rounded-full ${
                isActive ? 'animate-pulse' : ''
              }`}
              style={{
                top: `${15 + (i * 10)}%`,
                left: `${20 + (i * 8)}%`,
                animationDelay: `${i * 0.3}s`,
                opacity: isActive ? 1 : 0.3,
              }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={i + 8}
              className={`absolute w-0.5 h-0.5 bg-cosmic-accent rounded-full ${
                isActive ? 'animate-ping' : ''
              }`}
              style={{
                top: `${30 + (i * 12)}%`,
                right: `${15 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`,
                opacity: isActive ? 0.8 : 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay for better visibility */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/5 to-transparent" />
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