import React, { useMemo } from 'react';
import universeAvatarClosed from '@/assets/universe-avatar-call.jpg';
import universeAvatarOpen from '@/assets/universe-avatar-call-open.jpg';

interface UniverseAvatarProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const UniverseAvatar: React.FC<UniverseAvatarProps> = ({
  isActive,
  isSpeaking,
}) => {
  // Базовая картинка — закрытые глаза; поверх плавно проявляются открытые
  // зелёные глаза, когда звонок активен.
  const avatarSrc = universeAvatarClosed;

  // Создаем звезды для анимации - вдвое больше для активного состояния
  const stars = useMemo(() => {
    const starCount = isActive ? 24 : 12; // Вдвое больше звезд когда активен
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // избегаем краев
      y: Math.random() * 80 + 10,
      size: Math.random() * 1.5 + 0.5, // размер 0.5-2px
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 2 + 3}s`, // 3-5s
      moveDirection: Math.random() > 0.5 ? 'horizontal' : 'vertical',
      moveDistance: Math.random() * 8 + 4, // небольшое движение для аватара
    }));
  }, [isActive]);

  return (
    <div className="relative w-40 h-40 sm:w-44 sm:h-44 mx-auto">
      <style>{`
        @keyframes eye-shimmer {
          0%, 100% {
            opacity: 0.85;
            filter: brightness(1) saturate(1);
          }
          50% {
            opacity: 1;
            filter: brightness(1.25) saturate(1.4) drop-shadow(0 0 6px rgba(74,222,128,0.7));
          }
        }
        @keyframes eye-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 18px rgba(74,222,128,0.4), 0 0 40px rgba(34,197,94,0.2);
          }
          50% {
            box-shadow: 0 0 36px rgba(74,222,128,0.75), 0 0 80px rgba(34,197,94,0.45);
          }
        }
        @keyframes breath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes ring-expand {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .animate-eye-shimmer { animation: eye-shimmer 2.4s ease-in-out infinite; }
        .animate-eye-glow-pulse { animation: eye-glow-pulse 2.4s ease-in-out infinite; }
        .animate-breath { animation: breath 4s ease-in-out infinite; }
        .animate-ring-1 { animation: ring-expand 2.4s ease-out infinite; }
        .animate-ring-2 { animation: ring-expand 2.4s ease-out infinite 0.8s; }
        .animate-ring-3 { animation: ring-expand 2.4s ease-out infinite 1.6s; }
      `}</style>

      {/* Expanding energy rings while Universe is speaking */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-green-400/50 pointer-events-none animate-ring-1" />
          <div className="absolute inset-0 rounded-full border-2 border-green-400/40 pointer-events-none animate-ring-2" />
          <div className="absolute inset-0 rounded-full border-2 border-green-400/30 pointer-events-none animate-ring-3" />
        </>
      )}

      {/* Зелёное мерцающее свечение во время активного звонка */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-eye-glow-pulse"
          style={{
            boxShadow:
              '0 0 28px rgba(74,222,128,0.55), 0 0 60px rgba(34,197,94,0.35)',
          }}
        />
      )}

      {/* Main avatar circle with breathing animation */}
      <div
        className={`w-full h-full rounded-full border-4 transition-all duration-500 relative overflow-hidden animate-breath ${
          isActive
            ? 'border-green-400/70 shadow-lg shadow-green-400/40'
            : 'border-cosmic-accent/30 shadow-sm'
        }`}
      >
        {/* Базовый аватар — закрытые глаза */}
        <img
          src={avatarSrc}
          alt="Universe Avatar"
          className="w-full h-full object-cover rounded-full transition-all duration-500"
        />

        {/* Открытые зелёные глаза — плавно проявляются при подключении и
            мягко мерцают, имитируя живой взгляд Вселенной */}
        <img
          src={universeAvatarOpen}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover rounded-full transition-opacity duration-700 pointer-events-none ${
            isActive ? 'opacity-100 animate-eye-shimmer' : 'opacity-0'
          }`}
        />

        {/* Animated stars overlay */}
        <div className="absolute inset-0 rounded-full">
          {stars.map(star => {
            const moveKeyframes =
              star.moveDirection === 'horizontal'
                ? `@keyframes move-avatar-${star.id} {
                  0%, 100% { transform: translateX(0); }
                  50% { transform: translateX(${star.moveDistance}px); }
                }`
                : `@keyframes move-avatar-${star.id} {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(${star.moveDistance}px); }
                }`;

            return (
              <div key={star.id}>
                <style>{moveKeyframes}</style>
                <div
                  className="absolute rounded-full"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: isActive ? 0.9 : 0.4,
                    background: 'white',
                    boxShadow: `0 0 ${star.size * 3}px ${star.size}px rgba(255, 255, 255, 0.6)`,
                    animation: `star-shine ${star.animationDuration} infinite, move-avatar-${star.id} ${star.animationDuration} infinite ease-in-out`,
                    animationDelay: star.animationDelay,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Gradient overlay for better visibility */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
};
