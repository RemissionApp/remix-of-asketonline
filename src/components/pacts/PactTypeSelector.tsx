import React from 'react';
import { Heart, Zap, Shield, Star, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface PactType {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradientColor: string;
}

interface PactTypeSelectorProps {
  selectedType?: string;
  onTypeSelect: (type: string) => void;
  className?: string;
}

export const PactTypeSelector: React.FC<PactTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  className
}) => {
  const { language } = useAppStore();

  const getText = (key: string) => {
    const texts = {
      ru: {
        health: 'Здоровье',
        energy: 'Энергия', 
        protection: 'Защита',
        spiritual: 'Духовная',
        general: 'Общая',
        selectType: 'Выберите тип аскезы'
      },
      es: {
        health: 'Salud',
        energy: 'Energía',
        protection: 'Protección', 
        spiritual: 'Espiritual',
        general: 'General',
        selectType: 'Selecciona el tipo de ascesis'
      },
      en: {
        health: 'Health',
        energy: 'Energy',
        protection: 'Protection',
        spiritual: 'Spiritual',
        general: 'General', 
        selectType: 'Select ascesis type'
      }
    };
    return texts[language][key] || texts.en[key];
  };

  const pactTypes: PactType[] = [
    {
      id: 'health',
      icon: Heart,
      color: 'text-red-400',
      gradientColor: 'from-red-500/20 to-pink-500/20'
    },
    {
      id: 'energy',
      icon: Zap, 
      color: 'text-cosmic-accent',
      gradientColor: 'from-cosmic-accent/20 to-cosmic-accent2/20'
    },
    {
      id: 'protection',
      icon: Shield,
      color: 'text-blue-400',
      gradientColor: 'from-blue-500/20 to-indigo-500/20'
    },
    {
      id: 'spiritual',
      icon: Star,
      color: 'text-cosmic-gold',
      gradientColor: 'from-cosmic-gold/20 to-cosmic-indigo/20'
    },
    {
      id: 'general',
      icon: Target,
      color: 'text-cosmic-secondary',
      gradientColor: 'from-cosmic-secondary/20 to-cosmic-dark/20'
    }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-white text-center">
        {getText('selectType')}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pactTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={cn(
                'flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-300 hover-scale',
                'bg-gradient-to-br backdrop-blur-sm',
                isSelected
                  ? `border-current ${type.color} bg-gradient-to-br ${type.gradientColor} shadow-lg`
                  : 'border-cosmic-accent/30 bg-cosmic-dark/40 hover:border-cosmic-accent/60'
              )}
            >
              <IconComponent 
                className={cn(
                  'w-8 h-8 mb-2 transition-colors duration-200',
                  isSelected ? type.color : 'text-cosmic-secondary'
                )}
              />
              <span 
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  isSelected ? 'text-white' : 'text-cosmic-secondary'
                )}
              >
                {getText(type.id)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};