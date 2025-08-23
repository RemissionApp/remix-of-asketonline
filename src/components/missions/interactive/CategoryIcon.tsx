import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  category: 'ritual' | 'research' | 'social' | 'mystical' | 'challenge';
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  className,
}) => {
  const getCategoryConfig = () => {
    switch (category) {
      case 'ritual':
        return {
          icon: '🕯️',
          color: 'text-orange-400 bg-orange-400/20',
          tooltip: 'Ritual',
        };
      case 'research':
        return {
          icon: '📚',
          color: 'text-blue-400 bg-blue-400/20',
          tooltip: 'Research',
        };
      case 'social':
        return {
          icon: '🤝',
          color: 'text-green-400 bg-green-400/20',
          tooltip: 'Social',
        };
      case 'mystical':
        return {
          icon: '🔮',
          color: 'text-purple-400 bg-purple-400/20',
          tooltip: 'Mystical',
        };
      case 'challenge':
        return {
          icon: '⚔️',
          color: 'text-red-400 bg-red-400/20',
          tooltip: 'Challenge',
        };
      default:
        return {
          icon: '❓',
          color: 'text-gray-400 bg-gray-400/20',
          tooltip: 'Unknown',
        };
    }
  };

  const config = getCategoryConfig();

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110',
        config.color,
        className
      )}
      title={config.tooltip}
    >
      <span className="text-lg">{config.icon}</span>
    </div>
  );
};