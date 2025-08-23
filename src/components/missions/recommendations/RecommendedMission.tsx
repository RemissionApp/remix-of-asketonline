import React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useMissionManager } from '@/hooks/useMissionManager';
import { InteractiveMissionCard } from '../interactive/InteractiveMissionCard';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendedMissionProps {
  className?: string;
}

export const RecommendedMission: React.FC<RecommendedMissionProps> = ({
  className,
}) => {
  const { language } = useAppStore();
  const { getRecommendedMission } = useMissionManager();
  const [recommendedMission, setRecommendedMission] = React.useState(() => getRecommendedMission());
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const refreshRecommendation = async () => {
    setIsRefreshing(true);
    
    // Добавляем небольшую задержку для эффекта
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRecommendedMission(getRecommendedMission());
    setIsRefreshing(false);
  };

  if (!recommendedMission) {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="text-4xl mb-4">🌟</div>
        <p className="text-cosmic-silver">
          {language === 'ru'
            ? 'Сейчас нет подходящих рекомендаций. Завершите текущие миссии для получения новых.'
            : language === 'es'
              ? 'No hay recomendaciones adecuadas ahora. Completa las misiones actuales para obtener nuevas.'
              : 'No suitable recommendations right now. Complete current missions to unlock new ones.'}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cosmic-gold" />
          <h3 className="text-lg font-semibold text-cosmic-gold">
            {language === 'ru'
              ? 'Рекомендация для вас'
              : language === 'es'
                ? 'Recomendación para ti'
                : 'Recommended for you'}
          </h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshRecommendation}
          disabled={isRefreshing}
          className="border-cosmic-accent/30 text-cosmic-silver hover:text-white"
        >
          <RefreshCw 
            className={cn(
              "w-4 h-4 mr-2",
              isRefreshing && "animate-spin"
            )} 
          />
          {language === 'ru'
            ? 'Обновить'
            : language === 'es'
              ? 'Actualizar'
              : 'Refresh'}
        </Button>
      </div>

      {/* Recommendation Reason */}
      <div className="bg-cosmic-purple/10 border border-cosmic-purple/20 rounded-lg p-3">
        <p className="text-sm text-cosmic-silver">
          <span className="text-cosmic-purple font-medium">
            {language === 'ru'
              ? 'Почему эта миссия для вас: '
              : language === 'es'
                ? 'Por qué esta misión es para ti: '
                : 'Why this mission is for you: '}
          </span>
          {getRecommendationReason(recommendedMission, language)}
        </p>
      </div>

      {/* Mission Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-gold/20 to-cosmic-purple/20 rounded-lg blur opacity-75 animate-pulse"></div>
        <div className="relative">
          <InteractiveMissionCard
            mission={recommendedMission}
            className="border-cosmic-gold/30 shadow-cosmic-glow"
          />
        </div>
      </div>
    </div>
  );
};

// Функция для генерации причины рекомендации
const getRecommendationReason = (mission: any, language: string): string => {
  const reasons = {
    ru: {
      novice: 'Идеально подходит для начинающих в духовных практиках',
      explorer: 'Отличный выбор для расширения опыта и познаний',
      master: 'Серьёзный вызов для опытных практиков',
      'cosmic-warrior': 'Эпическое испытание для истинных мастеров',
      
      ritual: 'поможет создать священные ритуалы в вашей жизни',
      research: 'расширит ваши знания о духовных практиках',
      social: 'усилит ваше позитивное влияние на окружающих',
      mystical: 'откроет новые тайны и развивает интуицию',
      challenge: 'станет мощным катализатором трансформации'
    },
    en: {
      novice: 'Perfect for beginners in spiritual practices',
      explorer: 'Great choice for expanding experience and knowledge',
      master: 'Serious challenge for experienced practitioners',
      'cosmic-warrior': 'Epic trial for true masters',
      
      ritual: 'will help create sacred rituals in your life',
      research: 'will expand your knowledge of spiritual practices',
      social: 'will amplify your positive impact on others',
      mystical: 'will reveal new mysteries and develop intuition',
      challenge: 'will become a powerful catalyst for transformation'
    },
    es: {
      novice: 'Perfecto para principiantes en prácticas espirituales',
      explorer: 'Gran elección para expandir experiencia y conocimiento',
      master: 'Desafío serio para practicantes experimentados',
      'cosmic-warrior': 'Prueba épica para verdaderos maestros',
      
      ritual: 'ayudará a crear rituales sagrados en tu vida',
      research: 'expandirá tu conocimiento de prácticas espirituales',
      social: 'amplificará tu impacto positivo en otros',
      mystical: 'revelará nuevos misterios y desarrollará intuición',
      challenge: 'se convertirá en un catalizador poderoso para la transformación'
    }
  };

  const difficultyReason = reasons[language][mission.difficulty] || reasons.en[mission.difficulty];
  const categoryReason = reasons[language][mission.category] || reasons.en[mission.category];
  
  return `${difficultyReason} и ${categoryReason}.`;
};