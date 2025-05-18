
import React from 'react';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';

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
        <h2 className="text-2xl font-serif font-medium text-cosmic-gold mb-6 text-center">
          {t.universe.universeAnswer}
        </h2>
        
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
