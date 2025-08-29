import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalAudioManager } from '@/contexts/AudioContext';
import { logger } from '@/utils/logger';

export const NavigationAudioManager: React.FC = () => {
  const location = useLocation();
  const { stopAllAudio, getActiveAudioCount } = useGlobalAudioManager();

  useEffect(() => {
    const activeCount = getActiveAudioCount();
    
    if (activeCount > 0) {
      logger.info('Route changed, stopping all audio:', {
        from: location.pathname,
        activeAudioInstances: activeCount,
      });
      
      // Small delay to ensure smooth transition
      const timeoutId = setTimeout(() => {
        stopAllAudio();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname, stopAllAudio, getActiveAudioCount]);

  return null;
};