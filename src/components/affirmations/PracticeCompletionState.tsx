
import React from 'react';
import { CheckCircle } from "lucide-react";

interface PracticeCompletionStateProps {
  language: string;
}

export const PracticeCompletionState: React.FC<PracticeCompletionStateProps> = ({ language }) => {
  const completionMessage = language === 'ru'
    ? 'Вы успешно завершили практику аффирмации. Попробуйте повторять эту практику ежедневно для достижения наилучших результатов.'
    : language === 'es'
    ? 'Has completado con éxito la práctica de afirmación. Intenta repetir esta práctica diariamente para obtener los mejores resultados.'
    : 'You have successfully completed the affirmation practice. Try to repeat this practice daily for best results.';
    
  const reminderMessage = language === 'ru'
    ? 'Помните: повторение — мать учения. Регулярная практика аффирмаций перепрограммирует ваше подсознание.'
    : language === 'es'
    ? 'Recuerda: la repetición es la madre del aprendizaje. La práctica regular de afirmaciones reprograma tu subconsciente.'
    : 'Remember: repetition is the mother of learning. Regular practice of affirmations reprograms your subconscious.';
  
  return (
    <div className="mt-6 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-400" />
      </div>
      <p className="text-white/90">{completionMessage}</p>
      <p className="text-white/70 italic">{reminderMessage}</p>
    </div>
  );
};
