
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
              if (/^\d+\./.test(line.trim()) || 
                  line.includes("Дополнительные аспекты") ||
                  line.includes("Ключевые идеи") ||
                  line.includes("Критический анализ") ||
                  line.includes("Простыми словами") ||
                  line.includes("План действий") ||
                  line.includes("Нестандартные решения") ||
                  line.includes("Литература по теме")) {
                return (
                  <h3 key={lineIdx} className="text-cosmic-gold font-cormorant text-xl font-medium mt-4">
                    {line}
                  </h3>
                );
              }
              return <p key={lineIdx} className="text-white font-inter leading-relaxed">{line}</p>;
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
        <p className="text-white font-inter">{question}</p>
      </div>
      
      <div className="cosmic-card bg-cosmic-accent/10">
        <h2 className="text-lg font-cormorant font-medium text-cosmic-gold mb-4">
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
