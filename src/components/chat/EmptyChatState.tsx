import React from 'react';
import { MessageSquare, Stars } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';

export const EmptyChatState: React.FC = () => {
  const { t } = useTranslations();
  const { language } = useAppStore();
  const tr = (ru: string, en: string, es: string) =>
    language === 'ru' ? ru : language === 'es' ? es : en;
  const title = t.universe?.chatTitle || tr('Диалог с Лирой', 'Chat with Lyra', 'Diálogo con Lyra');
  const description = tr(
    'Задай вопрос, и Лира ответит тебе через язык звёзд, метафор и космической мудрости.',
    'Ask a question and Lyra will answer through the language of stars, metaphors and cosmic wisdom.',
    'Haz una pregunta y Lyra te responderá a través del lenguaje de las estrellas, metáforas y sabiduría cósmica.',
  );
  const subtitle = tr(
    'Каждый вопрос — это путешествие к осознанию...',
    'Every question is a journey toward awareness...',
    'Cada pregunta es un viaje hacia la conciencia...',
  );
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
        {title}
      </h3>
      <p className="text-cosmic-secondary text-center max-w-md mb-2">
        {description}
      </p>
      <p className="text-cosmic-secondary/70 text-sm text-center italic">
        {subtitle}
      </p>
    </div>
  );
};
