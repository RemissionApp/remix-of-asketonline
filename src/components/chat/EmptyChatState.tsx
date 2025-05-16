
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export const EmptyChatState: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="h-full flex items-center justify-center flex-col">
      <div className="w-20 h-20 bg-cosmic-accent/10 rounded-full flex items-center justify-center mb-4">
        <PlusCircle size={32} className="text-cosmic-accent" />
      </div>
      <p className="text-cosmic-secondary text-center max-w-xs">
        {t.universe?.startConversation || 'Начните диалог с Вселенной, задав свой первый вопрос'}
      </p>
    </div>
  );
};
