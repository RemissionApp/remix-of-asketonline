import { logger } from '@/utils/logger';

/**
 * Utility function to clean up audio resources
 */
export const cleanupPageAudio = () => {
  logger.debug('Cleaning up page audio resources');
  
  // Find all audio elements and stop them
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach((audio, index) => {
    try {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      
      // Revoke object URLs to free memory
      if (audio.src && audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
      
      logger.debug(`Cleaned up audio element ${index}`);
    } catch (error) {
      logger.warn(`Error cleaning up audio element ${index}:`, error);
    }
  });
};

/**
 * Utility to revoke object URLs safely
 */
export const revokeAudioURL = (url: string) => {
  try {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      logger.debug('Revoked audio URL:', url.substring(0, 50) + '...');
    }
  } catch (error) {
    logger.warn('Error revoking audio URL:', error);
  }
};

/**
 * Cleanup audio with error handling
 */
export const safeAudioCleanup = (audio: HTMLAudioElement | null) => {
  if (!audio) return;
  
  try {
    audio.pause();
    audio.currentTime = 0;
    
    if (audio.src) {
      revokeAudioURL(audio.src);
      audio.src = '';
    }
  } catch (error) {
    logger.warn('Error in safe audio cleanup:', error);
  }
};