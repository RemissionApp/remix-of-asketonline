
import React from 'react';
import { UniverseQuestion } from '@/types';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { useTranslations } from '@/hooks/useTranslations';

interface PreviousQuestionsProps {
  questions: UniverseQuestion[];
}

export const PreviousQuestions: React.FC<PreviousQuestionsProps> = ({ questions }) => {
  const { t } = useTranslations();
  
  if (questions.length === 0) return null;
  
  return (
    <div className="mt-12">
      <h3 className="text-lg font-cormorant font-medium text-cosmic-secondary mb-4">
        {t.universe.previousQuestions}
      </h3>
      
      <div className="space-y-4">
        {questions.slice(0, 3).map((q) => (
          <div key={q.id} className="cosmic-card bg-cosmic-dark/60">
            <p className="text-sm text-cosmic-secondary mb-2 font-inter">
              {new Date(q.created_at).toLocaleDateString()}
            </p>
            <p className="text-white mb-2 font-inter">{q.question}</p>
            <QuoteDisplay quote={q.answer} className="!text-sm !p-0 font-inter" />
          </div>
        ))}
      </div>
    </div>
  );
};
