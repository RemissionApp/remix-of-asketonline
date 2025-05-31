
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface TextToSpeechOptions {
  voice?: 'Aria' | 'Sarah' | 'Laura' | 'Charlie' | 'Charlotte' | 'Alice';
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

      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlaying(false);
      }

      console.log('Generating speech for text:', text.substring(0, 50) + '...');

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: options.voice || 'Aria',
          model: options.model || 'eleven_turbo_v2'
        }
      });

      if (error) {
        throw new Error(`Text-to-speech error: ${error.message}`);
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Create audio blob from base64
      const audioBlob = new Blob([
        new Uint8Array(
          atob(data.audioContent)
            .split('')
            .map(char => char.charCodeAt(0))
        )
      ], { type: 'audio/mpeg' });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Set up audio event listeners
      audio.onloadeddata = () => {
        console.log('Audio loaded, starting playback');
        setIsPlaying(true);
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
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

      setCurrentAudio(audio);

    } catch (error) {
      console.error('Error generating or playing speech:', error);
      setIsPlaying(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const stopSpeech = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return {
    generateAndPlaySpeech,
    stopSpeech,
    isGenerating,
    isPlaying
  };
};
