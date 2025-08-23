import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Star, Crown, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedReward } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface RewardCelebrationProps {
  reward: EnhancedReward;
  isVisible: boolean;
  onClose: () => void;
  celebrationMessage?: string;
}

export const RewardCelebration: React.FC<RewardCelebrationProps> = ({
  reward,
  isVisible,
  onClose,
  celebrationMessage,
}) => {
  const { language } = useAppStore();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getRewardIcon = () => {
    if (reward.cosmicArtifact) return <Crown className="w-8 h-8 text-yellow-400" />;
    if (reward.achievement) return <Star className="w-8 h-8 text-cosmic-gold" />;
    if (reward.energyPoints) return <Sparkles className="w-8 h-8 text-blue-400" />;
    return <Gift className="w-8 h-8 text-cosmic-accent" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-2 h-2 bg-cosmic-gold rounded-full animate-ping',
                'opacity-70'
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-md w-full">
        <div className="bg-gradient-to-br from-cosmic-dark via-cosmic-dark/90 to-cosmic-purple/20 rounded-2xl p-8 border border-cosmic-gold/30 shadow-2xl shadow-cosmic-gold/20">
          {/* Celebration Header */}
          <div className="text-center mb-6">
            <div className="mb-4 flex justify-center">
              {getRewardIcon()}
            </div>
            <h2 className="text-2xl font-bold text-cosmic-gold mb-2">
              {language === 'ru' 
                ? '🎉 Поздравляем!' 
                : language === 'es' 
                  ? '🎉 ¡Felicidades!' 
                  : '🎉 Congratulations!'}
            </h2>
            {celebrationMessage && (
              <p className="text-cosmic-secondary text-sm">
                {celebrationMessage}
              </p>
            )}
          </div>

          {/* Reward Details */}
          <div className="space-y-4 mb-6">
            {reward.energyPoints && (
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="text-white">
                    {language === 'ru' ? 'Энергия' : language === 'es' ? 'Energía' : 'Energy'}
                  </span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300">
                  +{reward.energyPoints}
                </Badge>
              </div>
            )}

            {reward.achievement && (
              <div className="flex items-center justify-between p-3 bg-cosmic-gold/10 rounded-lg border border-cosmic-gold/20">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-cosmic-gold" />
                  <span className="text-white">
                    {language === 'ru' ? 'Достижение' : language === 'es' ? 'Logro' : 'Achievement'}
                  </span>
                </div>
                <Badge className="bg-cosmic-gold/20 text-cosmic-gold">
                  {reward.achievement}
                </Badge>
              </div>
            )}

            {reward.cosmicArtifact && (
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">{reward.cosmicArtifact.name}</span>
                </div>
                <p className="text-sm text-cosmic-secondary mb-2">
                  {reward.cosmicArtifact.description}
                </p>
                <Badge className="bg-yellow-500/20 text-yellow-300">
                  {reward.cosmicArtifact.rarity}
                </Badge>
              </div>
            )}

            {reward.mysticalInsight && (
              <div className="p-3 bg-cosmic-accent/10 rounded-lg border border-cosmic-accent/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-cosmic-accent" />
                  <span className="text-white font-medium">{reward.mysticalInsight.title}</span>
                </div>
                <p className="text-sm text-cosmic-secondary">
                  {reward.mysticalInsight.content}
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-cosmic-gold hover:bg-cosmic-gold/80 text-cosmic-dark font-medium"
          >
            {language === 'ru' 
              ? 'Продолжить путешествие' 
              : language === 'es' 
                ? 'Continuar viaje' 
                : 'Continue Journey'}
          </Button>
        </div>
      </div>
    </div>
  );
};