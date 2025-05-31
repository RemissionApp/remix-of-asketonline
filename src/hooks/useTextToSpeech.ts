
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
  const [audioQueue, setAudioQueue] = useState<HTMLAudioElement[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  // Функция для разбивки текста на абзацы
  const splitTextIntoParagraphs = (text: string): string[] => {
    // Убираем хештеги и очищаем текст
    const cleanedText = text.replace(/#{1,6}\s*/g, '');
    
    // Разделяем на абзацы по двойным переносам строк или по точкам с большими пробелами
    const paragraphs = cleanedText
      .split(/\n\s*\n|\.\s{2,}/)
      .map(p => p.trim())
      .filter(p => p.length > 20); // Фильтруем слишком короткие фрагменты
    
    return paragraphs;
  };

  // Функция для генерации аудио для одного абзаца
  const generateAudioForParagraph = async (text: string, options: TextToSpeechOptions = {}): Promise<HTMLAudioElement | null> => {
    try {
      console.log('Generating audio for paragraph:', text.substring(0, 50) + '...');

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: options.voice || 'Custom',
          model: options.model || 'eleven_turbo_v2'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Text-to-speech error: ${error.message}`);
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Create audio blob from base64
      const binaryString = atob(data.audioContent);
      const audioArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioArray[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return audio;
    } catch (error) {
      console.error('Error generating audio for paragraph:', error);
      return null;
    }
  };

  // Функция для воспроизведения очереди аудио
  const playAudioQueue = async (audioQueue: HTMLAudioElement[]) => {
    if (audioQueue.length === 0) {
      setIsPlaying(false);
      setIsProcessingQueue(false);
      return;
    }

    setIsProcessingQueue(true);
    
    for (let i = 0; i < audioQueue.length; i++) {
      const audio = audioQueue[i];
      
      if (!audio) continue;

      try {
        setCurrentAudio(audio);
        setIsPlaying(true);

        // Ждем загрузки аудио
        await new Promise<void>((resolve, reject) => {
          audio.oncanplaythrough = () => resolve();
          audio.onerror = reject;
          audio.load();
        });

        // Воспроизводим аудио
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audio.src);
            resolve();
          };
          audio.onerror = reject;
          audio.play().catch(reject);
        });

      } catch (error) {
        console.error('Error playing audio segment:', error);
        URL.revokeObjectURL(audio.src);
      }
    }

    setCurrentAudio(null);
    setIsPlaying(false);
    setIsProcessingQueue(false);
    setAudioQueue([]);
  };

  const generateAndPlaySpeech = async (text: string, options: TextToSpeechOptions = {}) => {
    if (!text.trim()) return;

    try {
      setIsGenerating(true);
      console.log('Starting streaming speech generation...');

      // Принудительно останавливаем текущее аудио
      if (currentAudio || isProcessingQueue) {
        stopSpeech();
        await new Promise(resolve => setTimeout(resolve, 100)); // Небольшая задержка
      }

      // Разбиваем текст на абзацы
      const paragraphs = splitTextIntoParagraphs(text);
      console.log('Split text into', paragraphs.length, 'paragraphs');

      const audioSegments: HTMLAudioElement[] = [];

      // Генерируем аудио для каждого абзаца параллельно
      const audioPromises = paragraphs.map(paragraph => 
        generateAudioForParagraph(paragraph, options)
      );

      // Ждем завершения всех запросов
      const results = await Promise.all(audioPromises);
      
      // Фильтруем успешные результаты
      for (const audio of results) {
        if (audio) {
          audioSegments.push(audio);
        }
      }

      if (audioSegments.length === 0) {
        throw new Error('Failed to generate any audio segments');
      }

      console.log('Generated', audioSegments.length, 'audio segments');

      // Обновляем очередь и начинаем воспроизведение
      setAudioQueue(audioSegments);
      playAudioQueue(audioSegments);

    } catch (error) {
      console.error('Error generating or playing speech:', error);
      setIsPlaying(false);
      setCurrentAudio(null);
      setAudioQueue([]);
      setIsProcessingQueue(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const stopSpeech = () => {
    console.log('Stopping speech playback');
    
    // Останавливаем текущее аудио
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      URL.revokeObjectURL(currentAudio.src);
      setCurrentAudio(null);
    }

    // Очищаем очередь и освобождаем ресурсы
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
