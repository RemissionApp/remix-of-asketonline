
import React from 'react';
import { UniverseQuestion } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

interface PreviousQuestionsProps {
  questions: UniverseQuestion[];
}

export const PreviousQuestions: React.FC<PreviousQuestionsProps> = ({ questions }) => {
  const { t } = useTranslations();
  
  if (questions.length === 0) return null;
  
  // Function to format answers with proper heading styles
  const formatUniverseAnswer = (answer: string) => {
    // Limit the answer to a shorter preview
    const shortenedAnswer = answer.length > 150 ? answer.substring(0, 150) + '...' : answer;
    
    // Split into paragraphs for formatting
    const paragraphs = shortenedAnswer.split(/\n\s*\n/);
    
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="space-y-1">
            {paragraph.split('\n').map((line, lineIdx) => {
              // Apply the same heading detection logic as in UniverseAnswer
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
                  <h4 key={lineIdx} className="text-cosmic-gold font-serif text-sm font-bold">
                    {line}
                  </h4>
                );
              }
              return <p key={lineIdx} className="text-white font-sans text-sm">{line}</p>;
            })}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mt-12">
      <h3 className="text-xl font-serif font-medium text-cosmic-gold mb-6 text-center">
        {t.universe.previousQuestions}
      </h3>
      
      <div className="space-y-6">
        {questions.slice(0, 3).map((q) => (
          <div key={q.id} className="cosmic-card bg-cosmic-dark/60 hover:bg-cosmic-dark/80 transition-colors">
            <div className="mb-4">
              <p className="text-sm text-cosmic-secondary mb-1 font-sans">
                {new Date(q.created_at).toLocaleDateString()}
              </p>
              <h4 className="text-cosmic-accent font-serif font-medium mb-2">
                {q.question}
              </h4>
            </div>
            
            <div className="border-t border-cosmic-accent/20 pt-3">
              {formatUniverseAnswer(q.answer)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
