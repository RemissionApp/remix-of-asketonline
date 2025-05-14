
import { useAppStore } from "@/store/useAppStore";

export const useUserSubscription = () => {
  const setUserProfile = useAppStore(state => state.setUserProfile);
  const userProfile = useAppStore(state => state.userProfile);

  // Upgrade user to PRO status
  const upgradeToPro = () => {
    setUserProfile({ 
      ...userProfile, 
      isPro: true 
    });
  };

  // Cancel PRO subscription
  const cancelProSubscription = () => {
    setUserProfile({ 
      ...userProfile, 
      isPro: false 
    });
  };

  return {
    upgradeToPro,
    cancelProSubscription
  };
};
