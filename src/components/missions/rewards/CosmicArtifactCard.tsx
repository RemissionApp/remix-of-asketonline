import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Crown, Diamond } from 'lucide-react';
import { CosmicArtifactData } from '@/hooks/useCosmicArtifacts';
import { useAppStore } from '@/store/useAppStore';

interface CosmicArtifactCardProps {
  artifact: CosmicArtifactData;
  onToggle?: () => void;
  isSelected?: boolean;
}

export const CosmicArtifactCard: React.FC<CosmicArtifactCardProps> = ({
  artifact,
  onToggle,
  isSelected = false,
}) => {
  const { language } = useAppStore();

  const getRarityIcon = () => {
    switch (artifact.rarity) {
      case 'common':
        return <Star className="w-4 h-4" />;
      case 'rare':
        return <Sparkles className="w-4 h-4" />;
      case 'epic':
        return <Crown className="w-4 h-4" />;
      case 'legendary':
        return <Diamond className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getRarityColor = () => {
    switch (artifact.rarity) {
      case 'common':
        return 'text-gray-400 border-gray-400/30';
      case 'rare':
        return 'text-blue-400 border-blue-400/30';
      case 'epic':
        return 'text-purple-400 border-purple-400/30';
      case 'legendary':
        return 'text-yellow-400 border-yellow-400/30';
      default:
        return 'text-gray-400 border-gray-400/30';
    }
  };

  const getTypeText = () => {
    switch (artifact.type) {
      case 'crystal':
        return language === 'ru' ? 'Кристалл' : language === 'es' ? 'Cristal' : 'Crystal';
      case 'amulet':
        return language === 'ru' ? 'Амулет' : language === 'es' ? 'Amuleto' : 'Amulet';
      case 'mantra':
        return language === 'ru' ? 'Мантра' : language === 'es' ? 'Mantra' : 'Mantra';
      default:
        return artifact.type;
    }
  };

  return (
    <div
      className={cn(
        'relative border rounded-lg p-4 cursor-pointer transition-all duration-300',
        'bg-cosmic-dark/50 backdrop-blur-sm',
        getRarityColor(),
        isSelected && 'ring-2 ring-cosmic-gold shadow-lg shadow-cosmic-gold/20',
        artifact.is_active && 'bg-cosmic-gold/10',
        'hover:shadow-lg hover:transform hover:scale-105'
      )}
      onClick={onToggle}
    >
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        {getRarityIcon()}
      </div>

      {/* Active indicator */}
      {artifact.is_active && (
        <div className="absolute top-2 left-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-white mb-1">{artifact.name}</h3>
          <Badge variant="outline" className={cn('text-xs', getRarityColor())}>
            {getTypeText()}
          </Badge>
        </div>

        <p className="text-sm text-cosmic-secondary leading-relaxed">
          {artifact.description}
        </p>

        {artifact.effects.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs text-cosmic-gold font-medium">
              {language === 'ru' ? 'Эффекты:' : language === 'es' ? 'Efectos:' : 'Effects:'}
            </span>
            <ul className="space-y-1">
              {artifact.effects.map((effect, index) => (
                <li key={index} className="text-xs text-cosmic-secondary flex items-center">
                  <span className="w-1 h-1 bg-cosmic-gold rounded-full mr-2" />
                  {effect}
                </li>
              ))}
            </ul>
          </div>
        )}

        {artifact.obtained_from_mission && (
          <div className="text-xs text-cosmic-secondary/70">
            {language === 'ru' ? 'Получено из:' : language === 'es' ? 'Obtenido de:' : 'Obtained from:'}{' '}
            {artifact.obtained_from_mission}
          </div>
        )}

        <div className="text-xs text-cosmic-secondary/50">
          {new Date(artifact.obtained_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};