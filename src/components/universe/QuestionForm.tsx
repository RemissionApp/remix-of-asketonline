
import React, { useState } from 'react';
import { CosmicButton } from '@/components/CosmicButton';
import { toast } from 'sonner';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  language: string;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ 
  onSubmit, 
  isLoading, 
  language 
}) => {
  const [question, setQuestion] = useState('');
  
  // Проверка минимальной длины вопроса (100 символов)
  const isQuestionTooShort = question.trim().length < 100;
  const characterCount = question.length;
  const characterCountColor = isQuestionTooShort ? 'text-red-400' : 'text-cosmic-secondary';
  
  const handleSubmit = () => {
    if (isQuestionTooShort) {
      toast.error(language === 'ru' 
        ? 'Опишите свой вопрос подробнее (минимум 100 символов)' 
        : language === 'es' 
          ? 'Describe tu pregunta con más detalle (mínimo 100 caracteres)'
          : 'Describe your question in more detail (minimum 100 characters)');
      return;
    }
    
    onSubmit(question);
    setQuestion('');
  };
  
  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-cormorant font-medium text-white mb-6 text-center">
        {language === 'ru' 
          ? "Подробно опиши свою проблему Вселенной" 
          : language === 'es'
            ? "Describe detalladamente tu problema al Universo"
            : "Describe your problem to the Universe in detail"}
      </h2>
      
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={language === 'ru' 
          ? "Опиши свою ситуацию подробно (минимум 100 символов)..." 
          : language === 'es'
            ? "Describe tu situación en detalle (mínimo 100 caracteres)..."
            : "Describe your situation in detail (minimum 100 characters)..."}
        className="cosmic-input font-inter w-full h-40 resize-none mb-2"
      />
      
      {/* Счетчик символов */}
      <div className={`text-right mb-6 ${characterCountColor}`}>
        <span className="text-xs">
          {characterCount}/100 {language === 'ru' ? 'символов' : language === 'es' ? 'caracteres' : 'characters'}
        </span>
      </div>
      
      <CosmicButton 
        onClick={handleSubmit}
        className="w-full font-inter"
        variant="outline"
        disabled={isQuestionTooShort || isLoading}
      >
        {language === 'ru' 
          ? "Отправить вопрос" 
          : language === 'es'
            ? "Enviar pregunta"
            : "Send question"}
      </CosmicButton>
    </div>
  );
};
