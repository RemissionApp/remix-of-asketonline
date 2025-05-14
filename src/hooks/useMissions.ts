
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

export const useMissions = () => {
  const { userProfile, setUserProfile } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeMission = () => {
    if (!userProfile.activeMission) return;
    
    // Add energy points from the mission reward
    const energyPoints = userProfile.energyPoints || 0;
    const missionPoints = userProfile.activeMission.reward.energyPoints || 0;
    
    // Clear the active mission and award the points
    setUserProfile({
      ...userProfile,
      energyPoints: energyPoints + missionPoints,
      activeMission: null
    });
    
    return true;
  };

  return {
    userProfile,
    completeMission,
    loading,
    error
  };
};
