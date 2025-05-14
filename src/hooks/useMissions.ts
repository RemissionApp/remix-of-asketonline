
import { useAppStore } from '@/store/useAppStore';

export const useMissions = () => {
  const userProfile = useAppStore(state => state.userProfile);
  const setUserProfile = useAppStore(state => state.setUserProfile);
  
  // Complete the active mission
  const completeMission = () => {
    if (!userProfile.activeMission) return false;
    
    // Update the active mission to completed
    const updatedMission = { ...userProfile.activeMission, completed: true };
    
    // Update user profile with the completed mission and add any rewards
    setUserProfile({
      ...userProfile,
      energyPoints: userProfile.energyPoints + updatedMission.reward.energyPoints,
      activeMission: null,
    });
    
    return true;
  };
  
  return {
    completeMission
  };
};
