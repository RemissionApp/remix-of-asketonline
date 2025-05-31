import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

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
  
  // Получаем настройки звука из store
  const { soundEnabled, soundVolume } = useAppStore();

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
    // Проверяем, включен ли звук перед отправкой запроса
    if (!soundEnabled) {
      console.log('Sound is disabled, skipping audio generation');
      return null;
    }

    try {
      console.log('Generating audio for paragraph:', text.substring(0, 50) + '...');
      console.log('Using options:', options);

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
        console.error('No audio content received from API');
        throw new Error('No audio content received');
      }

      console.log('Received audio content, length:', data.audioContent.length);

      // Create audio blob from base64
      const binaryString = atob(data.audioContent);
      const audioArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioArray[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Created audio URL:', audioUrl);
      
      const audio = new Audio(audioUrl);
      
      // Устанавливаем громкость из настроек
      audio.volume = soundVolume;
      
      // Добавляем обработчики событий для отладки
      audio.addEventListener('loadstart', () => console.log('Audio load started'));
      audio.addEventListener('canplay', () => console.log('Audio can play'));
      audio.addEventListener('play', () => console.log('Audio play event'));
      audio.addEventListener('playing', () => console.log('Audio playing event'));
      audio.addEventListener('ended', () => console.log('Audio ended event'));
      audio.addEventListener('error', (e) => console.error('Audio error event:', e));

      return audio;
    } catch (error) {
      console.error('Error generating audio for paragraph:', error);
      return null;
    }
  };

  // Функция для воспроизведения очереди аудио
  const playAudioQueue = async (audioQueue: HTMLAudioElement[]) => {
    console.log('Starting to play audio queue, length:', audioQueue.length);
    
    if (audioQueue.length === 0) {
      console.log('Audio queue is empty, stopping playback');
      setIsPlaying(false);
      setIsProcessingQueue(false);
      return;
    }

    setIsProcessingQueue(true);
    
    for (let i = 0; i < audioQueue.length; i++) {
      const audio = audioQueue[i];
      console.log(`Playing audio segment ${i + 1}/${audioQueue.length}`);
      
      if (!audio) {
        console.warn(`Audio segment ${i} is null, skipping`);
        continue;
      }

      try {
        setCurrentAudio(audio);
        setIsPlaying(true);

        // Ждем загрузки аудио
        console.log('Waiting for audio to load...');
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.error('Audio load timeout');
            reject(new Error('Audio load timeout'));
          }, 10000);

          audio.oncanplaythrough = () => {
            console.log('Audio can play through');
            clearTimeout(timeout);
            resolve();
          };
          audio.onerror = (e) => {
            console.error('Audio load error:', e);
            clearTimeout(timeout);
            reject(new Error('Audio load failed'));
          };
          
          console.log('Loading audio...');
          audio.load();
        });

        // Воспроизводим аудио
        console.log('Starting audio playback...');
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.error('Audio play timeout');
            reject(new Error('Audio play timeout'));
          }, 30000);

          audio.onended = () => {
            console.log('Audio playback ended');
            clearTimeout(timeout);
            URL.revokeObjectURL(audio.src);
            resolve();
          };
          audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            clearTimeout(timeout);
            reject(new Error('Audio playback failed'));
          };
          
          audio.play().then(() => {
            console.log('Audio.play() succeeded');
          }).catch((playError) => {
            console.error('Audio.play() failed:', playError);
            clearTimeout(timeout);
            reject(playError);
          });
        });

      } catch (error) {
        console.error('Error playing audio segment:', error);
        URL.revokeObjectURL(audio.src);
      }
    }

    console.log('Finished playing audio queue');
    setCurrentAudio(null);
    setIsPlaying(false);
    setIsProcessingQueue(false);
    setAudioQueue([]);
  };

  const generateAndPlaySpeech = async (text: string, options: TextToSpeechOptions = {}) => {
    // Проверяем, включен ли звук перед началом генерации
    if (!soundEnabled) {
      console.log('Sound is disabled, skipping speech generation');
      return;
    }

    if (!text.trim()) {
      console.warn('Empty text provided to generateAndPlaySpeech');
      return;
    }

    try {
      setIsGenerating(true);
      console.log('Starting speech generation for text:', text);
      console.log('Using options:', options);

      // Принудительно останавливаем текущее аудио
      if (currentAudio || isProcessingQueue) {
        console.log('Stopping current audio before starting new one');
        stopSpeech();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Разбиваем текст на абзацы
      const paragraphs = splitTextIntoParagraphs(text);
      console.log('Split text into paragraphs:', paragraphs);

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
          // Устанавливаем текущую громкость для каждого аудио сегмента
          audio.volume = soundVolume;
          audioSegments.push(audio);
        }
      }

      if (audioSegments.length === 0) {
        throw new Error('Failed to generate any audio segments');
      }

      console.log('Generated audio segments:', audioSegments.length);

      // Обновляем очередь и начинаем воспроизведение
      setAudioQueue(audioSegments);
      await playAudioQueue(audioSegments);

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
