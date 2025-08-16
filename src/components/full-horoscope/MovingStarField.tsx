import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
  color: string;
  twinkleSpeed: number;
}

export const MovingStarField: React.FC = () => {
  // Generate stars with random properties
  const stars = useMemo(() => {
    const starCount = 200; // Increased from 100 to 200 stars

    // Array of possible star colors
    const starColors = [
      'rgb(255, 255, 255)', // White
      'rgb(255, 223, 186)', // Warm white/yellowish
      'rgb(173, 216, 230)', // Light blue
      'rgb(211, 211, 255)', // Light purple
      'rgb(255, 192, 203)', // Pink
      'rgb(240, 230, 140)', // Khaki/gold
      'rgb(175, 238, 238)', // Pale turquoise
    ];

    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // position as percentage
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // px size between 1-4 (increased max size)
      opacity: Math.random() * 0.5 + 0.3, // opacity between 0.3-0.8
      speed: Math.random() * 20 + 5, // animation duration in seconds (increased variability)
      direction: Math.random() > 0.5 ? 1 : -1, // direction of movement
      color: starColors[Math.floor(Math.random() * starColors.length)], // random color
      twinkleSpeed: Math.random() * 3 + 1, // twinkle animation speed between 1-4s
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(star => {
        // Create unique keyframe animations for each star
        const floatAnimation = `
          @keyframes float-${star.id} {
            0% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(
                ${star.direction * (Math.random() * 30)}px, 
                ${Math.random() > 0.5 ? '-' : ''}${Math.random() * 30}px
              );
            }
            100% {
              transform: translate(0, 0);
            }
          }
        `;

        const twinkleAnimation = `
          @keyframes twinkle-${star.id} {
            0%, 100% {
              opacity: ${star.opacity * 0.4};
              box-shadow: 0 0 ${star.size}px ${star.size / 2}px ${star.color}80;
            }
            50% {
              opacity: ${star.opacity * 1.5 > 1 ? 1 : star.opacity * 1.5};
              box-shadow: 0 0 ${star.size * 3}px ${star.size}px ${star.color};
            }
          }
        `;

        return (
          <React.Fragment key={star.id}>
            <style>{floatAnimation}</style>
            <style>{twinkleAnimation}</style>
            <div
              className="absolute rounded-full"
              style={{
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 2}px ${star.size / 2}px ${star.color}`,
                animation: `float-${star.id} ${star.speed}s infinite ease-in-out, twinkle-${star.id} ${star.twinkleSpeed}s infinite ease-in-out`,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
