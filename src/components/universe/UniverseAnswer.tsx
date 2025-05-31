
import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface UniverseAnswerProps {
  question: string;
  answer: string;
  onNewQuestion: () => void;
}

export const UniverseAnswer: React.FC<UniverseAnswerProps> = ({
  question,
  answer,
  onNewQuestion
}) => {
  const { t } = useTranslations();
  const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } = useTextToSpeech();
  
  // Функция для воспроизведения ответа
  const handlePlayAnswer = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      generateAndPlaySpeech(answer, { 
        voice: 'Custom', 
        model: 'eleven_multilingual_v2' 
      });
    }
  };
  
  // Функция для форматирования ответа с разделением на абзацы
  const formatUniverseAnswer = (answer: string) => {
    // Разделяем текст на абзацы по двойным переносам строк
    const paragraphs = answer.split(/\n\s*\n/);
    
    return (
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="space-y-2">
            {paragraph.split('\n').map((line, lineIdx) => {
              // Выделяем заголовки (числа в начале строки или фразы, похожие на заголовки)
              if (/^\d+[\.\)]\s/.test(line.trim()) || 
                  line.includes("Сегодня я буду в этой роли") ||
                  line.includes("Хочу дополнить") ||
                  line.includes("Вот принцип 20/80 и основная суть") ||
                  line.includes("Твои слабые места и пробелы") ||
                  line.includes("Вот простыми словами") ||
                  line.includes("Ломаем шаблоны") ||
                  line.includes("План действий") ||
                  line.includes("Дополнительные аспекты") ||
                  line.includes("Ключевые идеи") ||
                  line.includes("Критический анализ") ||
                  line.includes("Простыми словами") ||
                  line.includes("Нестандартные решения") ||
                  line.includes("Литература по теме")) {
                return (
                  <h3 key={lineIdx} className="text-cosmic-gold font-serif text-xl font-bold mt-4">
                    {line}
                  </h3>
                );
              }
              return <p key={lineIdx} className="text-white font-sans leading-relaxed">{line}</p>;
            })}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="animate-fade-in w-full">
      <div className="cosmic-card mb-6">
        <h2 className="text-lg font-cormorant font-medium text-cosmic-accent mb-2">
          {t.universe.yourQuestion}
        </h2>
        <p className="text-white font-sans">{question}</p>
      </div>
      
      <div className="cosmic-card bg-cosmic-accent/10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h2 className="text-2xl font-serif font-medium text-cosmic-gold text-center">
            {t.universe.universeAnswer}
          </h2>
          
          <button
            onClick={handlePlayAnswer}
            disabled={isGenerating}
            className="p-2 rounded-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 transition-colors border border-cosmic-accent/30"
            title={isPlaying ? 'Остановить' : 'Воспроизвести ответ'}
          >
            {isGenerating ? (
              <Loader2 size={20} className="text-cosmic-accent animate-spin" />
            ) : isPlaying ? (
              <VolumeX size={20} className="text-cosmic-accent" />
            ) : (
              <Volume2 size={20} className="text-cosmic-accent" />
            )}
          </button>
        </div>
        
        {formatUniverseAnswer(answer)}
        
        <div className="mt-8 flex justify-center">
          <CosmicButton 
            onClick={onNewQuestion} 
            variant="outline"
          >
            {t.universe.newQuestion}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};
