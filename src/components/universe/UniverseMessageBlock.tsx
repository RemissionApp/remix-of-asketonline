import React, { memo } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';

const UniverseMessageBlockComponent: React.FC = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();

  const handleQuestionClick = () => {
    navigate('/universe');
  };

  const universeTitle =
    language === 'ru'
      ? 'Задать вопрос Вселенной'
      : language === 'es'
        ? 'Hacer una pregunta a Lyra'
        : 'Ask Lyra a question';

  const subtitle =
    language === 'ru'
      ? 'Получите ясный ответ и направление прямо сейчас'
      : language === 'es'
        ? 'Recibe una respuesta clara y una dirección ahora'
        : 'Receive a clear answer and direction right now';

  return (
    <button
      onClick={handleQuestionClick}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-gold/20 via-cosmic-dark/60 to-cosmic-accent/20 p-5 text-left shadow-lg shadow-cosmic-gold/10 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-gold/80 to-cosmic-accent/60 shadow-[0_0_30px_rgba(232,193,108,0.3)]">
          <MessageCircleQuestion className="relative h-7 w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0 text-center">
          <div className={`text-base font-semibold text-white ${language === 'en' ? 'font-serif' : ''}`}>{universeTitle}</div>
          <div className="mt-0.5 text-xs text-cosmic-secondary">{subtitle}</div>
        </div>
      </div>
    </button>
  );
};

export const UniverseMessageBlock = memo(UniverseMessageBlockComponent);
