import React from 'react';
import { Achievement } from '@/types';

interface AchievementCardWrapperProps {
  achievement: Achievement;
}

const AchievementCardWrapper: React.FC<AchievementCardWrapperProps> = ({ achievement }) => {
  // This component is temporary and meant to be removed once the error is fixed
  // by updating the Achievement type definition
  const fixedAchievement = {
    ...achievement,
    unlocked: achievement.unlockedAt !== null
  };
  
  return null; // This is a placeholder, not meant to be rendered
};

export default AchievementCardWrapper;
