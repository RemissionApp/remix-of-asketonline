import { useState, useEffect, useId, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';
import { useSingletonAudio } from '@/contexts/SingletonAudioContext';
import { safeAudioCleanup } from '@/utils/audioCleanup';

export interface TextToSpeechOptions {
  voice?:
    | 'Custom'
    | 'Aria'
    | 'Sarah'
    | 'Laura'
    | 'Charlie'
    | 'Charlotte'
    | 'Alice';
  model?: 'eleven_turbo_v2' | 'eleven_multilingual_v2';
}

export const useOptimizedTextToSpeech = () => {
  const instanceId = useId();
  const { soundEnabled, soundVolume } = useAppStore();
  const { setActiveAudio, stopCurrentAudio, getCurrentInstanceId, isAudioActive } = useSingletonAudio();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioQueue, setAudioQueue] = useState<HTMLAudioElement[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const currentSessionId = useRef<string | null>(null);

  const splitTextIntoParagraphs = (text: string): string[] => {
    // Don't split short texts
    if (text.length < 200) {
      return [text];
    }
    
    const cleanedText = text.replace(/#{1,6}\s*/g, '');
    const paragraphs = cleanedText
      .split(/\n\s*\n|\.\s{2,}/)
      .map(p => p.trim())
      .filter(p => p.length > 30);

    // Limit to maximum 2 segments to prevent too many API calls
    return paragraphs.slice(0, 2);
  };

  const generateAudioForParagraph = async (
    text: string,
    options: TextToSpeechOptions = {}
  ): Promise<HTMLAudioElement | null> => {
    if (!soundEnabled) {
      logger.debug('Sound disabled, skipping audio generation');
      return null;
    }

    try {
      logger.debug(
        'Generating audio for paragraph:',
        text.substring(0, 50) + '...'
      );

      const { data, error } = await supabase.functions.invoke(
        'text-to-speech',
        {
          body: {
            text,
            voice: options.voice || 'Custom',
            model: options.model || 'eleven_turbo_v2',
          },
        }
      );

      if (error) {
        logger.error('Supabase function error:', error);
        throw new Error(`Text-to-speech error: ${error.message}`);
      }

      if (!data?.audioContent) {
        logger.error('No audio content received from API');
        throw new Error('No audio content received');
      }

      const binaryString = atob(data.audioContent);
      const audioArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioArray[i] = binaryString.charCodeAt(i);
      }

      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.volume = soundVolume;

      audio.addEventListener('error', e => logger.error('Audio error:', e));

      return audio;
    } catch (error) {
      logger.error('Error generating audio for paragraph:', error);
      return null;
    }
  };

  const playAudioQueue = async (audioQueue: HTMLAudioElement[], sessionId: string) => {
    if (!soundEnabled || audioQueue.length === 0) {
      setIsPlaying(false);
      setIsProcessingQueue(false);
      return;
    }

    setIsProcessingQueue(true);

    for (let i = 0; i < audioQueue.length; i++) {
      // Check if session is still current
      if (currentSessionId.current !== sessionId) {
        logger.info('Session changed, stopping audio queue');
        break;
      }

      const audio = audioQueue[i];

      if (!audio) {
        logger.warn(`Audio segment ${i} is null, skipping`);
        continue;
      }

      try {
        // Stop any other singleton audio and set this as active
        setActiveAudio(audio, instanceId);
        setCurrentAudio(audio);
        setIsPlaying(true);

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            logger.error('Audio load timeout');
            reject(new Error('Audio load timeout'));
          }, 10000);

          audio.oncanplaythrough = () => {
            clearTimeout(timeout);
            resolve();
          };
          audio.onerror = e => {
            logger.error('Audio load error:', e);
            clearTimeout(timeout);
            reject(new Error('Audio load failed'));
          };

          audio.load();
        });

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            logger.error('Audio play timeout');
            reject(new Error('Audio play timeout'));
          }, 30000);

          audio.onended = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(audio.src);
            setActiveAudio(null, instanceId);
            resolve();
          };
          audio.onerror = e => {
            logger.error('Audio playback error:', e);
            clearTimeout(timeout);
            reject(new Error('Audio playback failed'));
          };

          audio.play().catch(playError => {
            logger.error('Audio.play() failed:', playError);
            clearTimeout(timeout);
            reject(playError);
          });
        });
      } catch (error) {
        logger.error('Error playing audio segment:', error);
        URL.revokeObjectURL(audio.src);
      }
    }

    setCurrentAudio(null);
    setActiveAudio(null, instanceId);
    setIsPlaying(false);
    setIsProcessingQueue(false);
    setAudioQueue([]);
  };

  const generateAndPlaySpeech = async (
    text: string,
    options: TextToSpeechOptions = {}
  ) => {
    if (!soundEnabled) {
      logger.debug('Sound disabled, skipping speech generation');
      return;
    }

    if (!text.trim()) {
      logger.warn('Empty text provided to generateAndPlaySpeech');
      return;
    }

    // Check if we need to interrupt another session
    if (isGenerating) {
      logger.info('Already generating, ignoring new request');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Create new session ID
      const sessionId = `${instanceId}-${Date.now()}`;
      currentSessionId.current = sessionId;
      
      logger.debug('Starting speech generation for text:', text.substring(0, 50) + '...');

      // Stop any existing singleton audio
      stopCurrentAudio();

      if (currentAudio || isProcessingQueue) {
        stopSpeech();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const paragraphs = splitTextIntoParagraphs(text);
      const audioSegments: HTMLAudioElement[] = [];

      // Generate audio sequentially to prevent API overload
      for (const paragraph of paragraphs) {
        // Check if session is still current
        if (currentSessionId.current !== sessionId) {
          logger.info('Session interrupted, stopping generation');
          return;
        }

        const audio = await generateAudioForParagraph(paragraph, options);
        if (audio) {
          audioSegments.push(audio);
        }
        
        // Small delay between requests to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (audioSegments.length === 0) {
        throw new Error('Failed to generate any audio segments');
      }

      // Check if session is still current before playing
      if (currentSessionId.current !== sessionId) {
        logger.info('Session interrupted, not playing audio');
        audioSegments.forEach(audio => safeAudioCleanup(audio));
        return;
      }

      setAudioQueue(audioSegments);
      await playAudioQueue(audioSegments, sessionId);
    } catch (error) {
      logger.error('Error generating or playing speech:', error);
      setIsPlaying(false);
      setCurrentAudio(null);
      setAudioQueue([]);
      setIsProcessingQueue(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const stopSpeech = () => {
    // Invalidate current session
    currentSessionId.current = null;
    
    // Debounce multiple rapid calls
    if (
      !currentAudio &&
      audioQueue.length === 0 &&
      !isPlaying &&
      !isProcessingQueue
    ) {
      return;
    }

    logger.info('Stopping speech playback');

    // Stop singleton audio
    stopCurrentAudio();

    // Stop current audio efficiently
    if (currentAudio) {
      safeAudioCleanup(currentAudio);
      setCurrentAudio(null);
    }

    // Clear queue efficiently
    if (audioQueue.length > 0) {
      audioQueue.forEach(audio => safeAudioCleanup(audio));
      setAudioQueue([]);
    }

    setIsPlaying(false);
    setIsProcessingQueue(false);
  };

  // No need for global audio manager registration with singleton system

  // Auto cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  return {
    generateAndPlaySpeech,
    stopSpeech,
    isGenerating,
    isPlaying: isPlaying || isProcessingQueue,
  };
};
