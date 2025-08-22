import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createLogger } from '@/utils/logger';

interface UseVoiceInputOptions {
  language?: string;
  onTranscription?: (text: string) => void;
  onError?: (error: string) => void;
}

interface VoiceInputState {
  isRecording: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  error: string | null;
}

export const useVoiceInput = (options: UseVoiceInputOptions = {}) => {
  const { language = 'ru', onTranscription, onError } = options;
  const logger = createLogger('useVoiceInput');
  
  const [state, setState] = useState<VoiceInputState>({
    isRecording: false,
    isProcessing: false,
    isSupported: !!navigator.mediaDevices?.getUserMedia,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      if (!navigator.mediaDevices?.getUserMedia) {
        const errorMsg = 'Голосовой ввод не поддерживается в этом браузере';
        setState(prev => ({ ...prev, error: errorMsg }));
        onError?.(errorMsg);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setState(prev => ({ ...prev, isRecording: true }));
      logger.info('Recording started');

    } catch (error) {
      logger.error('Error starting recording:', error);
      const errorMsg = 'Не удалось получить доступ к микрофону';
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
    }
  }, [language, onTranscription, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false, isProcessing: true }));
      logger.info('Recording stopped');
    }
  }, [state.isRecording]);

  const processAudio = useCallback(async (audioBlob: Blob) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1]; // Remove data:audio/wav;base64, prefix
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: {
          audioData: base64Audio,
          language: language,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.text) {
        logger.info('Transcription successful:', data.text);
        onTranscription?.(data.text);
      } else {
        throw new Error('Не удалось распознать речь');
      }

    } catch (error) {
      logger.error('Error processing audio:', error);
      const errorMsg = 'Ошибка при обработке голосового ввода';
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [language, onTranscription, onError]);

  const toggleRecording = useCallback(() => {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [state.isRecording, startRecording, stopRecording]);

  return {
    ...state,
    startRecording,
    stopRecording,
    toggleRecording,
  };
};