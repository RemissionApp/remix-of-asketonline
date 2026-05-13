import React, { useEffect, useState } from 'react';

interface WaveVisualizationProps {
  isActive: boolean;
  intensity: number;
}

export const WaveVisualization: React.FC<WaveVisualizationProps> = ({
  isActive,
  intensity,
}) => {
  const [waveData, setWaveData] = useState<number[]>(Array(20).fill(0.1));

  useEffect(() => {
    if (!isActive) {
      setWaveData(Array(20).fill(0.1));
      return;
    }

    const interval = setInterval(() => {
      setWaveData(prev => prev.map(() => Math.random() * intensity + 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, intensity]);

  return (
    <div className="relative flex items-center justify-center gap-1 h-16 px-4">
      {waveData.map((height, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-emerald-400 via-cosmic-accent to-cosmic-accent/40 rounded-full transition-all duration-100 ease-out"
          style={{
            width: '3px',
            height: `${Math.max(height * 50, 4)}px`,
            opacity: isActive ? 1 : 0.3,
            animationDelay: `${index * 50}ms`,
          }}
        />
      ))}

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          isActive ? `bg-emerald-500/20 blur-xl opacity-60` : 'opacity-0'
        }`}
        style={{
          transform: 'scale(1.5)',
        }}
      />
    </div>
  );
};
