import React, { useMemo } from 'react';

interface StarFieldProps {
  starCount?: number;
  galaxyCount?: number;
}

export const StarField: React.FC<StarFieldProps> = ({
  starCount = 60, // Reduced for mobile performance
  galaxyCount = 3, // Reduced for mobile performance
}) => {
  // Создаем массив с случайными позициями и размерами для звезд
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // % позиция
      y: Math.random() * 100, // % позиция
      size: Math.random() * 2 + 1, // размер в px между 1-3px
      animationDelay: `${Math.random() * 5}s`, // Случайная задержка анимации
      animationDuration: `${Math.random() * 3 + 4}s`, // Случайная продолжительность анимации
      moveDirection: Math.random() > 0.5 ? 'horizontal' : 'vertical', // Случайное направление движения
      moveDistance: Math.random() * 20 + 10, // Расстояние движения (в пикселях)
    }));
  }, [starCount]);

  // Создаем массив с галактиками
  const galaxies = useMemo(() => {
    return Array.from({ length: galaxyCount }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // % позиция (не слишком близко к краям)
      y: Math.random() * 80 + 10, // % позиция (не слишком близко к краям)
      size: Math.random() * 150 + 100, // размер в px между 100-250px
      rotation: Math.random() * 360, // случайный градус поворота
      opacity: Math.random() * 0.3 + 0.2, // полупрозрачность
      animationDelay: `${Math.random() * 10}s`, // Случайная задержка анимации
    }));
  }, [galaxyCount]);

  return (
    <div className="main-background fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Background image optimized for mobile */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//un1.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1,
          opacity: 1,
          filter: 'brightness(1.3)',
          width: '100vw',
          height: '100vh',
        }}
      />

      {/* Mobile-optimized overlay */}
      <div
        className="absolute inset-0 bg-cosmic-dark/40"
        style={{ zIndex: -1 }}
      ></div>

      {/* Галактики */}
      {galaxies.map(galaxy => (
        <div
          key={`galaxy-${galaxy.id}`}
          className="absolute rounded-full animate-pulse-slow"
          style={{
            left: `${galaxy.x}%`,
            top: `${galaxy.y}%`,
            width: `${galaxy.size}px`,
            height: `${galaxy.size}px`,
            opacity: galaxy.opacity,
            transform: `rotate(${galaxy.rotation}deg)`,
            background:
              'radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, rgba(145, 185, 255, 0.15) 40%, rgba(10, 6, 30, 0) 70%)',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
            animationDelay: galaxy.animationDelay,
          }}
        />
      ))}

      {/* Звезды */}
      {stars.map(star => {
        const moveKeyframes =
          star.moveDirection === 'horizontal'
            ? `@keyframes move-${star.id} {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(${star.moveDistance}px); }
            }`
            : `@keyframes move-${star.id} {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(${star.moveDistance}px); }
            }`;

        return (
          <div key={star.id}>
            <style>{moveKeyframes}</style>
            <div
              className="star absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: Math.random() * 0.7 + 0.3,
                background: 'white',
                boxShadow: `0 0 ${star.size * 2}px ${star.size / 2}px rgba(255, 255, 255, 0.8)`,
                animation: `star-shine ${star.animationDuration} infinite, move-${star.id} ${star.animationDuration} infinite ease-in-out`,
                animationDelay: star.animationDelay,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
