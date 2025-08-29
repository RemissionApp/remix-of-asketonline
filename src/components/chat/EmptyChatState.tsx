import React from 'react';
import { MessageSquare, Stars } from 'lucide-react';

export const EmptyChatState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-cosmic-dark border border-cosmic-accent/10 flex items-center justify-center overflow-hidden">
          <Stars className="absolute h-full w-full text-cosmic-accent/10" />
          <MessageSquare size={32} className="text-cosmic-accent/50" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-cosmic-accent/20 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-1 -left-1 w-4 h-4 bg-cosmic-accent/10 rounded-full animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>
      </div>

      <h3 className="text-xl font-serif text-cosmic-accent mb-2 text-center">
        Звонок Вселенной
      </h3>
      <p className="text-cosmic-secondary text-center max-w-md mb-2">
        Задайте вопрос, и Вселенная ответит вам через язык звёзд, метафор и
        космической мудрости.
      </p>
      <p className="text-cosmic-secondary/70 text-sm text-center italic">
        Каждый вопрос — это путешествие к осознанию...
      </p>
    </div>
  );
};
