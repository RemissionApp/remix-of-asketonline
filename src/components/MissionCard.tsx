import React from 'react';
import { Mission } from '@/types';
import { InteractiveMissionCard } from './missions/interactive/InteractiveMissionCard';

interface MissionCardProps {
  mission?: Mission;
  className?: string;
  onComplete?: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  className,
  onComplete,
}) => {
  return (
    <InteractiveMissionCard
      mission={mission}
      className={className}
      onComplete={onComplete}
    />
  );
};
