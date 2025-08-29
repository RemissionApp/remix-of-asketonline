import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalAudioManager } from '@/contexts/AudioContext';
import { logger } from '@/utils/logger';

export const NavigationAudioManager: React.FC = () => {
  const location = useLocation();
  const { stopAllAudio, getActiveAudioCount } = useGlobalAudioManager();

  useEffect(() => {
    const activeCount = getActiveAudioCount();
    
    // Don't stop audio on certain pages where it should continue
    const persistAudioPages = ['/create-pact'];
    const shouldPersistAudio = persistAudioPages.some(page => 
      location.pathname.startsWith(page)
    );
    
    if (activeCount > 0 && !shouldPersistAudio) {
      logger.info('Route changed, stopping all audio:', {
        to: location.pathname,
        activeAudioInstances: activeCount,
      });
      
      // Immediate stop for route changes
      stopAllAudio();
    } else if (shouldPersistAudio) {
      logger.debug('Preserving audio on page:', location.pathname);
    }
  }, [location.pathname, stopAllAudio, getActiveAudioCount]);

  return null;
};