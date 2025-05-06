
import React from 'react';

interface StarFieldProps {
  starCount?: number;
}

export const StarField: React.FC<StarFieldProps> = ({ starCount = 100 }) => {
  // Create an array with random positions and sizes for our stars
  const stars = React.useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // % position
      y: Math.random() * 100, // % position
      size: Math.random() * 2 + 1, // px size between 1-3px
      animationDelay: `${Math.random() * 5}s`, // Random animation delay
    }));
  }, [starCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-star-shine"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: Math.random() * 0.7 + 0.3,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
};
