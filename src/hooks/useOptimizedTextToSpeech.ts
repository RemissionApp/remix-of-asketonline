import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';

export interface TextToSpeechOptions {
  voice?: 'Custom' | 'Aria' | 'Sarah' | 'Laura' | 'Charlie' | 'Charlotte' | 'Alice';
  model?: 'eleven_turbo_v2' | 'eleven_multilingual_v2';
}

export const useOptimizedTextToSpeech = () => {
  const { soundEnabled, soundVolume } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioQueue, setAudioQueue] = useState<HTMLAudioElement[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  const splitTextIntoParagraphs = (text: string): string[] => {
    const cleanedText = text.replace(/#{1,6}\s*/g, '');
    const paragraphs = cleanedText
      .split(/\n\s*\n|\.\s{2,}/)
      .map(p => p.trim())
      .filter(p => p.length > 20);
    
    return paragraphs;
  };

  const generateAudioForParagraph = async (text: string, options: TextToSpeechOptions = {}): Promise<HTMLAudioElement | null> => {
    if (!soundEnabled) {
      logger.debug('Sound disabled, skipping audio generation');
      return null;
    }

    try {
      logger.debug('Generating audio for paragraph:', text.substring(0, 50) + '...');

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: options.voice || 'Custom',
          model: options.model || 'eleven_turbo_v2'
        }
      });

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

      audio.addEventListener('error', (e) => logger.error('Audio error:', e));

      return audio;
    } catch (error) {
      logger.error('Error generating audio for paragraph:', error);
      return null;
    }
  };

  const playAudioQueue = async (audioQueue: HTMLAudioElement[]) => {
    if (!soundEnabled || audioQueue.length === 0) {
      setIsPlaying(false);
      setIsProcessingQueue(false);
      return;
    }

    setIsProcessingQueue(true);
    
    for (let i = 0; i < audioQueue.length; i++) {
      const audio = audioQueue[i];
      
      if (!audio) {
        logger.warn(`Audio segment ${i} is null, skipping`);
        continue;
      }

      try {
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
          audio.onerror = (e) => {
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
            resolve();
          };
          audio.onerror = (e) => {
            logger.error('Audio playback error:', e);
            clearTimeout(timeout);
            reject(new Error('Audio playback failed'));
          };
          
          audio.play().catch((playError) => {
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
    setIsPlaying(false);
    setIsProcessingQueue(false);
    setAudioQueue([]);
  };

  const generateAndPlaySpeech = async (text: string, options: TextToSpeechOptions = {}) => {
    if (!soundEnabled) {
      logger.debug('Sound disabled, skipping speech generation');
      return;
    }

    if (!text.trim()) {
      logger.warn('Empty text provided to generateAndPlaySpeech');
      return;
    }

    try {
      setIsGenerating(true);
      logger.debug('Starting speech generation for text:', text.substring(0, 50) + '...');

      if (currentAudio || isProcessingQueue) {
        stopSpeech();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const paragraphs = splitTextIntoParagraphs(text);
      const audioSegments: HTMLAudioElement[] = [];

      const audioPromises = paragraphs.map(paragraph => 
        generateAudioForParagraph(paragraph, options)
      );

      const results = await Promise.all(audioPromises);
      
      for (const audio of results) {
        if (audio) {
          audioSegments.push(audio);
        }
      }

      if (audioSegments.length === 0) {
        throw new Error('Failed to generate any audio segments');
      }

      setAudioQueue(audioSegments);
      await playAudioQueue(audioSegments);

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
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      URL.revokeObjectURL(currentAudio.src);
      setCurrentAudio(null);
    }

    audioQueue.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      URL.revokeObjectURL(audio.src);
    });

    setAudioQueue([]);
    setIsPlaying(false);
    setIsProcessingQueue(false);
  };

  return {
    generateAndPlaySpeech,
    stopSpeech,
    isGenerating,
    isPlaying: isPlaying || isProcessingQueue
  };
};