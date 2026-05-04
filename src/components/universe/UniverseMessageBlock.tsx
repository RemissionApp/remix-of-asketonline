import React, { memo } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';

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
    <GlassCard
      icon={MessageCircleQuestion}
      variant="gold"
      title={universeTitle}
      subtitle={subtitle}
      onClick={handleQuestionClick}
    />
  );
};

export const UniverseMessageBlock = memo(UniverseMessageBlockComponent);
