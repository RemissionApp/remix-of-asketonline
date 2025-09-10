import React from 'react';
import { cn } from '@/lib/utils';
import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useMissionManager } from '@/hooks/useMissionManager';
import { InteractiveMissionCard } from '../interactive/InteractiveMissionCard';
import { useMissionActions } from '@/hooks/useMissionActions';
import { Sparkles, Target, Users, BookOpen } from 'lucide-react';

interface MissionCategoriesProps {
  className?: string;
}

export const MissionCategories: React.FC<MissionCategoriesProps> = ({
  className,
}) => {
  const { language } = useAppStore();
  const { getMissionsByCategory, getMissionMotivation } = useMissionManager();
  const { startMission, isLoading } = useMissionActions();
  const [selectedCategory, setSelectedCategory] = React.useState<Mission['category'] | 'all'>('all');

  const categories = [
    {
      id: 'all' as const,
      name: language === 'ru' ? 'Все миссии' : language === 'es' ? 'Todas' : 'All Missions',
      icon: Target,
      color: 'text-cosmic-gold bg-cosmic-gold/20',
      description: language === 'ru' ? 'Показать все доступные миссии' : language === 'es' ? 'Mostrar todas las misiones' : 'Show all available missions'
    },
    {
      id: 'ritual' as const,
      name: language === 'ru' ? 'Ритуальные' : language === 'es' ? 'Rituales' : 'Rituals',
      icon: Sparkles,
      color: 'text-orange-400 bg-orange-400/20',
      description: language === 'ru' ? 'Духовные практики и ритуалы' : language === 'es' ? 'Prácticas espirituales y rituales' : 'Spiritual practices and rituals'
    },
    {
      id: 'mystical' as const,
      name: language === 'ru' ? 'Мистические' : language === 'es' ? 'Místicas' : 'Mystical',
      icon: BookOpen,
      color: 'text-purple-400 bg-purple-400/20',
      description: language === 'ru' ? 'Исследование тайн и знаков' : language === 'es' ? 'Exploración de misterios y señales' : 'Exploring mysteries and signs'
    },
    {
      id: 'social' as const,
      name: language === 'ru' ? 'Социальные' : language === 'es' ? 'Sociales' : 'Social',
      icon: Users,
      color: 'text-green-400 bg-green-400/20',
      description: language === 'ru' ? 'Влияние на мир и людей' : language === 'es' ? 'Impacto en el mundo y las personas' : 'Impact on world and people'
    },
    {
      id: 'challenge' as const,
      name: language === 'ru' ? 'Вызовы' : language === 'es' ? 'Desafíos' : 'Challenges',
      icon: Target,
      color: 'text-red-400 bg-red-400/20',
      description: language === 'ru' ? 'Интенсивные трансформации' : language === 'es' ? 'Transformaciones intensas' : 'Intensive transformations'
    }
  ];

  const getFilteredMissions = (): Mission[] => {
    if (selectedCategory === 'all') {
      const allCategories: Mission['category'][] = ['ritual', 'mystical', 'social', 'challenge'];
      return allCategories.flatMap(cat => getMissionsByCategory(cat));
    }
    return getMissionsByCategory(selectedCategory);
  };

  const filteredMissions = getFilteredMissions();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category Filter */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'p-4 rounded-lg border transition-all duration-200 hover:scale-105 group',
                isSelected
                  ? `${category.color} border-current`
                  : 'border-cosmic-accent/20 text-cosmic-silver hover:text-white hover:border-cosmic-accent/40'
              )}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Icon 
                  size={24} 
                  className={cn(
                    'transition-colors',
                    isSelected ? 'text-current' : 'group-hover:text-cosmic-gold'
                  )} 
                />
                <div>
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs opacity-70 mt-1 hidden lg:block">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Category Info */}
      {selectedCategory !== 'all' && (
        <div className="bg-cosmic-accent/10 border border-cosmic-accent/20 rounded-lg p-4">
          <p className="text-cosmic-silver text-center italic">
            {getMissionMotivation({ category: selectedCategory } as Mission)}
          </p>
        </div>
      )}

      {/* Missions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filteredMissions.length > 0 ? (
          filteredMissions.map((mission) => (
            <InteractiveMissionCard
              key={mission.id}
              mission={mission}
              onStart={() => startMission(mission)}
              className={`w-full ${isLoading ? 'opacity-75 pointer-events-none' : ''}`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">🌟</div>
            <p className="text-cosmic-silver">
              {language === 'ru'
                ? 'В этой категории пока нет доступных миссий'
                : language === 'es'
                  ? 'No hay misiones disponibles en esta categoría aún'
                  : 'No missions available in this category yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};