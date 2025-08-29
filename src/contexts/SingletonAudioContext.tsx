import React, { createContext, useContext, useRef, useCallback, ReactNode } from 'react';
import { logger } from '@/utils/logger';
import { safeAudioCleanup } from '@/utils/audioCleanup';

interface SingletonAudioContextType {
  setActiveAudio: (audio: HTMLAudioElement | null, instanceId: string) => void;
  stopCurrentAudio: () => void;
  getCurrentInstanceId: () => string | null;
  isAudioActive: () => boolean;
}

const SingletonAudioContext = createContext<SingletonAudioContextType | undefined>(undefined);

export const useSingletonAudio = () => {
  const context = useContext(SingletonAudioContext);
  if (!context) {
    throw new Error('useSingletonAudio must be used within SingletonAudioProvider');
  }
  return context;
};

interface SingletonAudioProviderProps {
  children: ReactNode;
}

export const SingletonAudioProvider: React.FC<SingletonAudioProviderProps> = ({ children }) => {
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const currentInstanceId = useRef<string | null>(null);

  const setActiveAudio = useCallback((audio: HTMLAudioElement | null, instanceId: string) => {
    // Stop any existing audio first
    if (currentAudio.current && currentAudio.current !== audio) {
      logger.info(`Stopping previous audio ${currentInstanceId.current} to start new one ${instanceId}`);
      safeAudioCleanup(currentAudio.current);
    }

    currentAudio.current = audio;
    currentInstanceId.current = instanceId;
    
    if (audio) {
      logger.debug('Set active audio for instance:', instanceId);
      
      // Auto-cleanup when audio ends
      const handleEnded = () => {
        if (currentAudio.current === audio) {
          currentAudio.current = null;
          currentInstanceId.current = null;
          logger.debug('Audio ended, cleared singleton reference');
        }
      };
      
      audio.addEventListener('ended', handleEnded);
    } else {
      logger.debug('Cleared active audio');
    }
  }, []);

  const stopCurrentAudio = useCallback(() => {
    if (currentAudio.current) {
      logger.info('Stopping current singleton audio:', currentInstanceId.current);
      safeAudioCleanup(currentAudio.current);
      currentAudio.current = null;
      currentInstanceId.current = null;
    }
  }, []);

  const getCurrentInstanceId = useCallback(() => {
    return currentInstanceId.current;
  }, []);

  const isAudioActive = useCallback(() => {
    return currentAudio.current !== null && !currentAudio.current.paused;
  }, []);

  const value: SingletonAudioContextType = {
    setActiveAudio,
    stopCurrentAudio,
    getCurrentInstanceId,
    isAudioActive,
  };

  return (
    <SingletonAudioContext.Provider value={value}>
      {children}
    </SingletonAudioContext.Provider>
  );
};