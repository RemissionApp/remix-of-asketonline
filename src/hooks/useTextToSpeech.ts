
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface TextToSpeechOptions {
  voice?: 'Custom' | 'Aria' | 'Sarah' | 'Laura' | 'Charlie' | 'Charlotte' | 'Alice';
  model?: 'eleven_turbo_v2' | 'eleven_multilingual_v2';
}

export const useTextToSpeech = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const generateAndPlaySpeech = async (text: string, options: TextToSpeechOptions = {}) => {
    if (!text.trim()) return;

    try {
      setIsGenerating(true);
      console.log('Starting speech generation...', { text: text.substring(0, 50), options });

      // Принудительно останавливаем текущее аудио если оно играет
      if (currentAudio) {
        console.log('Stopping current audio before starting new one');
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.src = '';
        setIsPlaying(false);
        setCurrentAudio(null);
      }

      console.log('Generating speech for text:', text.substring(0, 50) + '...');

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: options.voice || 'Custom',
          model: options.model || 'eleven_turbo_v2'
        }
      });

      console.log('Edge function response:', { data: data ? 'received' : 'null', error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Text-to-speech error: ${error.message}`);
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      console.log('Audio content received, creating blob...');

      // Create audio blob from base64 more efficiently
      try {
        const binaryString = atob(data.audioContent);
        const audioArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          audioArray[i] = binaryString.charCodeAt(i);
        }
        
        const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        console.log('Audio object created, setting up event listeners...');

        // Set up audio event listeners
        audio.oncanplaythrough = () => {
          console.log('Audio can play through, starting playback');
          setIsPlaying(true);
          audio.play().catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
            setCurrentAudio(null);
          });
        };

        audio.onended = () => {
          console.log('Audio playback finished');
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          setCurrentAudio(null);
        };

        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          setCurrentAudio(null);
        };

        // Устанавливаем текущее аудио сразу
        setCurrentAudio(audio);

        // Начинаем загрузку аудио
        audio.load();

      } catch (audioError) {
        console.error('Error creating audio from base64:', audioError);
        throw new Error('Failed to create audio from response');
      }

    } catch (error) {
      console.error('Error generating or playing speech:', error);
      setIsPlaying(false);
      setCurrentAudio(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const stopSpeech = () => {
    console.log('Stopping speech playback');
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  return {
    generateAndPlaySpeech,
    stopSpeech,
    isGenerating,
    isPlaying
  };
};
