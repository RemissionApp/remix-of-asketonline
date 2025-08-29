import React, { createContext, useContext, useRef, useCallback, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface AudioInstance {
  id: string;
  stop: () => void;
  isActive: boolean;
}

interface AudioContextType {
  registerAudioInstance: (id: string, stopFunction: () => void) => void;
  unregisterAudioInstance: (id: string) => void;
  stopAllAudio: () => void;
  stopAllExcept: (excludeId: string) => void;
  getActiveAudioCount: () => number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useGlobalAudioManager = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useGlobalAudioManager must be used within AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioInstances = useRef<Map<string, AudioInstance>>(new Map());

  const registerAudioInstance = useCallback((id: string, stopFunction: () => void) => {
    logger.debug('Registering audio instance:', id);
    
    // Stop any existing instance with the same ID
    const existing = audioInstances.current.get(id);
    if (existing && existing.isActive) {
      existing.stop();
    }

    audioInstances.current.set(id, {
      id,
      stop: stopFunction,
      isActive: true,
    });
  }, []);

  const unregisterAudioInstance = useCallback((id: string) => {
    logger.debug('Unregistering audio instance:', id);
    const instance = audioInstances.current.get(id);
    if (instance) {
      instance.isActive = false;
      audioInstances.current.delete(id);
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    logger.info('Stopping all audio instances');
    const instances = Array.from(audioInstances.current.values());
    
    instances.forEach(instance => {
      if (instance.isActive) {
        try {
          instance.stop();
        } catch (error) {
          logger.warn(`Error stopping audio instance ${instance.id}:`, error);
        }
      }
    });

    // Clear all instances
    audioInstances.current.clear();
  }, []);

  const stopAllExcept = useCallback((excludeId: string) => {
    logger.info('Stopping all audio except:', excludeId);
    const instances = Array.from(audioInstances.current.values());
    
    instances.forEach(instance => {
      if (instance.isActive && instance.id !== excludeId) {
        try {
          instance.stop();
        } catch (error) {
          logger.warn(`Error stopping audio instance ${instance.id}:`, error);
        }
        audioInstances.current.delete(instance.id);
      }
    });
  }, []);

  const getActiveAudioCount = useCallback(() => {
    return Array.from(audioInstances.current.values()).filter(
      instance => instance.isActive
    ).length;
  }, []);

  const value: AudioContextType = {
    registerAudioInstance,
    unregisterAudioInstance,
    stopAllAudio,
    stopAllExcept,
    getActiveAudioCount,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};