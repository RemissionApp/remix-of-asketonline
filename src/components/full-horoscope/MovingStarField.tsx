
import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
}

export const MovingStarField: React.FC = () => {
  // Generate stars with random properties
  const stars = useMemo(() => {
    const starCount = 100;
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // position as percentage
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // px size between 1-3
      opacity: Math.random() * 0.5 + 0.3, // opacity between 0.3-0.8
      speed: Math.random() * 15 + 5, // animation duration in seconds
      direction: Math.random() > 0.5 ? 1 : -1, // direction of movement
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => {
        // Create a unique keyframe animation for each star
        const keyframeAnimation = `
          @keyframes float-${star.id} {
            0% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(
                ${star.direction * (Math.random() * 20)}px, 
                ${Math.random() > 0.5 ? '-' : ''}${Math.random() * 20}px
              );
            }
            100% {
              transform: translate(0, 0);
            }
          }
        `;

        return (
          <React.Fragment key={star.id}>
            <style>{keyframeAnimation}</style>
            <div
              className="absolute rounded-full bg-white"
              style={{
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 2}px ${star.size / 2}px rgba(255, 255, 255, 0.8)`,
                animation: `float-${star.id} ${star.speed}s infinite ease-in-out, star-shine ${Math.random() * 3 + 2}s infinite ease-in-out`,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
