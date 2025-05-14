
import React from 'react';

interface EnergyEffectProps {
  show: boolean;
  value?: number;
}

export const EnergyEffect: React.FC<EnergyEffectProps> = ({ show, value = 10 }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
      <div className="animate-pulse-slow">
        <div className="text-cosmic-gold text-3xl font-bold animate-bounce">
          +{value}
        </div>
      </div>
    </div>
  );
};
