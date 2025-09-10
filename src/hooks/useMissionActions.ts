import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GamificationSlice } from '@/store/slices/gamificationSlice';
import { useMissionManager } from './useMissionManager';
import { Mission } from '@/types';

export const useMissionActions = () => {
  const store = useAppStore() as any;
  const startMissionAction = store.startMission;
  const { canAcceptMission } = useMissionManager();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartMission = async (mission: Mission): Promise<boolean> => {
    if (!canAcceptMission(mission)) {
      return false;
    }

    setIsLoading(true);
    try {
      const success = await startMissionAction(mission.id);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startMission: handleStartMission,
    isLoading,
  };
};