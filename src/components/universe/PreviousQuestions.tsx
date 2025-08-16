import React, { useState } from 'react';
import { UniverseQuestion } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PreviousQuestionsProps {
  questions: UniverseQuestion[];
}

export const PreviousQuestions: React.FC<PreviousQuestionsProps> = ({
  questions,
}) => {
  const { t } = useTranslations();
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});

  if (questions.length === 0) return null;

  // Toggle expanded state for a specific question
  const toggleExpand = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Function to format answers with proper heading styles
  const formatUniverseAnswer = (answer: string, isExpanded: boolean) => {
    // For collapsed state, show a preview
    const displayAnswer = isExpanded
      ? answer
      : answer.length > 150
        ? answer.substring(0, 150) + '...'
        : answer;

    // Split into paragraphs for formatting
    const paragraphs = displayAnswer.split(/\n\s*\n/);

    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="space-y-1">
            {paragraph.split('\n').map((line, lineIdx) => {
              // Apply the same heading detection logic as in UniverseAnswer
              if (
                /^\d+[\.\)]\s/.test(line.trim()) ||
                line.includes('Сегодня я буду в этой роли') ||
                line.includes('Хочу дополнить') ||
                line.includes('Вот принцип 20/80 и основная суть') ||
                line.includes('Твои слабые места и пробелы') ||
                line.includes('Вот простыми словами') ||
                line.includes('Ломаем шаблоны') ||
                line.includes('План действий') ||
                line.includes('Дополнительные аспекты') ||
                line.includes('Ключевые идеи') ||
                line.includes('Критический анализ') ||
                line.includes('Простыми словами') ||
                line.includes('Нестандартные решения') ||
                line.includes('Литература по теме')
              ) {
                return (
                  <h4
                    key={lineIdx}
                    className="text-cosmic-gold font-serif text-sm font-bold"
                  >
                    {line}
                  </h4>
                );
              }
              return (
                <p key={lineIdx} className="text-white font-sans text-sm">
                  {line}
                </p>
              );
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
        {questions.slice(0, 3).map(q => {
          const isExpanded = expandedQuestions[q.id] || false;

          return (
            <div
              key={q.id}
              className="cosmic-card bg-cosmic-dark/60 hover:bg-cosmic-dark/80 transition-colors"
            >
              <div className="mb-3">
                <p className="text-sm text-cosmic-secondary mb-1 font-sans">
                  {new Date(q.created_at).toLocaleDateString()}
                </p>
                <h4 className="text-cosmic-accent font-serif font-medium">
                  {q.question}
                </h4>
              </div>

              <Collapsible open={isExpanded}>
                <div className="border-t border-cosmic-accent/20 pt-3">
                  <CollapsibleContent>
                    {formatUniverseAnswer(q.answer, true)}
                  </CollapsibleContent>

                  {!isExpanded && (
                    <div className="preview-content">
                      {formatUniverseAnswer(q.answer, false)}
                    </div>
                  )}
                </div>

                <CollapsibleTrigger
                  onClick={() => toggleExpand(q.id)}
                  className="w-full flex justify-center items-center mt-2 py-2 text-cosmic-secondary hover:text-cosmic-accent transition-colors"
                >
                  {isExpanded ? (
                    <div className="flex items-center">
                      <span className="text-sm mr-1">Свернуть</span>
                      <ChevronUp size={16} />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm mr-1">Развернуть</span>
                      <ChevronDown size={16} />
                    </div>
                  )}
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
};
