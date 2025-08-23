import React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

interface DifficultyBadgeProps {
  difficulty: 'novice' | 'explorer' | 'master' | 'cosmic-warrior';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className,
}) => {
  const { language } = useAppStore();

  const getDifficultyConfig = () => {
    switch (difficulty) {
      case 'novice':
        return {
          label: language === 'ru' ? 'Новичок' : language === 'es' ? 'Principiante' : 'Novice',
          color: 'text-green-400 bg-green-400/20 border-green-400/30',
          icon: '🌱',
        };
      case 'explorer':
        return {
          label: language === 'ru' ? 'Исследователь' : language === 'es' ? 'Explorador' : 'Explorer',
          color: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
          icon: '🔍',
        };
      case 'master':
        return {
          label: language === 'ru' ? 'Мастер' : language === 'es' ? 'Maestro' : 'Master',
          color: 'text-purple-400 bg-purple-400/20 border-purple-400/30',
          icon: '⚡',
        };
      case 'cosmic-warrior':
        return {
          label: language === 'ru' ? 'Космический воин' : language === 'es' ? 'Guerrero cósmico' : 'Cosmic Warrior',
          color: 'text-cosmic-gold bg-cosmic-gold/20 border-cosmic-gold/30',
          icon: '🌟',
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-400 bg-gray-400/20 border-gray-400/30',
          icon: '❓',
        };
    }
  };

  const config = getDifficultyConfig();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium transition-all duration-200 hover:scale-105',
        config.color,
        className
      )}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};