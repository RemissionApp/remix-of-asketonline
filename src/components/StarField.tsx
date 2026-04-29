import React, { useMemo } from 'react';
import bgImage from '@/assets/cosmic-bg.jpg';

interface StarFieldProps {
  starCount?: number;
  galaxyCount?: number;
}

export const StarField: React.FC<StarFieldProps> = ({
  starCount = 60, // Reduced for mobile performance
  galaxyCount = 3, // Reduced for mobile performance
}) => {
  // Создаём массив с случайными позициями и размерами для звезд.
  // ВАЖНО: opacity тоже мемоизирован — иначе мерцание при каждом ре-рендере.
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 4}s`,
      // 0..3 — выбор одного из 4 предзаготовленных keyframe-наборов
      // (горизонтальный/вертикальный × short/long).
      variant: Math.floor(Math.random() * 4),
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
      {/* Background image. backgroundAttachment:'fixed' не используем — на iOS WebView
          он не работает; вместо этого сам контейнер уже fixed inset-0. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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

      {/* Звёзды используют 4 общих keyframe-набора из starfield.css —
          никаких <style>-тегов в DOM на каждую звезду. */}
      {stars.map(star => (
        <div
          key={star.id}
          className={`star absolute rounded-full starfield-move-${star.variant}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            background: 'white',
            boxShadow: `0 0 ${star.size * 2}px ${star.size / 2}px rgba(255, 255, 255, 0.8)`,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
};
