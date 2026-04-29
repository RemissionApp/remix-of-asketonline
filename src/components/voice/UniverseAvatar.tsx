import React, { useMemo } from 'react';
import universeAvatarCall from '@/assets/universe-avatar-call.jpg';

interface UniverseAvatarProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const UniverseAvatar: React.FC<UniverseAvatarProps> = ({
  isActive,
  isSpeaking,
}) => {
  // Космический образ Вселенной — единый для активного и неактивного состояний
  const avatarSrc = universeAvatarCall;

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
    <div className="relative w-32 h-32 mx-auto">
      {/* Main avatar circle */}
      <div
        className={`w-full h-full rounded-full border-4 transition-all duration-500 relative overflow-hidden ${
          isActive
            ? 'border-cosmic-accent shadow-lg shadow-cosmic-accent/50'
            : 'border-cosmic-accent/30 shadow-sm'
        }`}
      >
        {/* Universe Avatar Image */}
        <img
          src={avatarSrc}
          alt="Universe Avatar"
          className="w-full h-full object-cover rounded-full transition-all duration-500"
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
