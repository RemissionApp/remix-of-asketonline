import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { calculateDestinyMatrix, getMatrixNumberMeaning } from '@/utils/numerologyUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Info, Sparkles } from 'lucide-react';

interface DestinyMatrixProps {
  birthDate: string;
  name?: string;
  language?: string;
}

interface MatrixCellProps {
  number: number;
  type: 'basic' | 'karmic' | 'talent' | 'destiny';
  position: string;
  onClick: (number: number, type: string, position: string) => void;
  className?: string;
}

const MatrixCell: React.FC<MatrixCellProps> = ({ number, type, position, onClick, className = '' }) => {
  const getTypeColor = (cellType: string) => {
    switch (cellType) {
      case 'destiny':
        return 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/40 text-yellow-400';
      case 'karmic':
        return 'from-purple-400/20 to-purple-600/20 border-purple-400/40 text-purple-400';
      case 'talent':
        return 'from-green-400/20 to-green-600/20 border-green-400/40 text-green-400';
      default:
        return 'from-cosmic-accent/20 to-cosmic-accent/40 border-cosmic-accent/40 text-cosmic-accent';
    }
  };

  return (
    <button
      onClick={() => onClick(number, type, position)}
      className={`
        relative w-16 h-16 rounded-lg bg-gradient-to-br ${getTypeColor(type)}
        border backdrop-blur-sm transition-all duration-300
        hover:scale-110 hover:shadow-lg hover:shadow-current/20
        active:scale-95 animate-fade-in
        flex items-center justify-center font-serif text-xl font-bold
        ${className}
      `}
    >
      <span className="relative z-10">{number}</span>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg" />
      
      {type === 'destiny' && (
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
      )}
    </button>
  );
};

export const DestinyMatrix: React.FC<DestinyMatrixProps> = ({ 
  birthDate, 
  name = '', 
  language = 'ru' 
}) => {
  const [selectedNumber, setSelectedNumber] = useState<{
    number: number;
    type: string;
    position: string;
  } | null>(null);
  const isMobile = useIsMobile();

  const matrixData = calculateDestinyMatrix(birthDate, name);

  const handleCellClick = (number: number, type: string, position: string) => {
    setSelectedNumber({ number, type, position });
  };

  const getPositionName = (position: string) => {
    const positions: Record<string, { ru: string; en: string; es: string }> = {
      'spiritual': { ru: 'Духовное', en: 'Spiritual', es: 'Espiritual' },
      'personal': { ru: 'Личная карма', en: 'Personal Karma', es: 'Karma Personal' },
      'material': { ru: 'Материальное', en: 'Material', es: 'Material' },
      'social': { ru: 'Социальная карма', en: 'Social Karma', es: 'Karma Social' },
      'destiny': { ru: 'Центр судьбы', en: 'Destiny Center', es: 'Centro del Destino' },
      'planetary': { ru: 'Планетарная карма', en: 'Planetary Karma', es: 'Karma Planetario' },
      'planet': { ru: 'Планетное', en: 'Planetary', es: 'Planetario' },
      'cosmic': { ru: 'Космическая карма', en: 'Cosmic Karma', es: 'Karma Cósmico' },
      'day': { ru: 'День рождения', en: 'Birth Day', es: 'Día de Nacimiento' },
      'talent1': { ru: 'Талант 1', en: 'Talent 1', es: 'Talento 1' },
      'talent2': { ru: 'Талант 2', en: 'Talent 2', es: 'Talento 2' },
      'talent3': { ru: 'Талант 3', en: 'Talent 3', es: 'Talento 3' },
      'talent4': { ru: 'Талант 4', en: 'Talent 4', es: 'Talento 4' },
    };
    
    const pos = positions[position];
    return pos ? pos[language as keyof typeof pos] || pos.ru : position;
  };

  const getMeaning = () => {
    if (!selectedNumber) return null;
    return getMatrixNumberMeaning(
      selectedNumber.number, 
      selectedNumber.type as 'basic' | 'karmic' | 'talent' | 'destiny',
      language
    );
  };

  const meaning = getMeaning();

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-serif text-cosmic-accent mb-2">
          {language === 'ru' ? 'Матрица судьбы' : 
           language === 'es' ? 'Matriz del Destino' : 
           'Destiny Matrix'}
        </h3>
        <p className="text-cosmic-secondary text-sm">
          {language === 'ru' ? 'Нажмите на число для подробного описания' :
           language === 'es' ? 'Toca un número para descripción detallada' :
           'Tap a number for detailed description'}
        </p>
      </div>

      {/* Main Matrix Grid */}
      <div className="relative">
        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Row 1 */}
          <MatrixCell 
            number={matrixData.spiritualNumber} 
            type="basic" 
            position="spiritual"
            onClick={handleCellClick}
          />
          <MatrixCell 
            number={matrixData.personalKarma} 
            type="karmic" 
            position="personal"
            onClick={handleCellClick}
          />
          <MatrixCell 
            number={matrixData.materialNumber} 
            type="basic" 
            position="material"
            onClick={handleCellClick}
          />
          
          {/* Row 2 */}
          <MatrixCell 
            number={matrixData.socialKarma} 
            type="karmic" 
            position="social"
            onClick={handleCellClick}
          />
          <MatrixCell 
            number={matrixData.destinyCenter} 
            type="destiny" 
            position="destiny"
            onClick={handleCellClick}
            className="scale-110 ring-2 ring-yellow-400/30"
          />
          <MatrixCell 
            number={matrixData.planetaryKarma} 
            type="karmic" 
            position="planetary"
            onClick={handleCellClick}
          />
          
          {/* Row 3 */}
          <MatrixCell 
            number={matrixData.planetNumber} 
            type="basic" 
            position="planet"
            onClick={handleCellClick}
          />
          <MatrixCell 
            number={matrixData.cosmicKarma} 
            type="karmic" 
            position="cosmic"
            onClick={handleCellClick}
          />
          <MatrixCell 
            number={matrixData.dayNumber} 
            type="basic" 
            position="day"
            onClick={handleCellClick}
          />
        </div>

        {/* Connecting Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-accent/30 to-transparent" />
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cosmic-accent/30 to-transparent" />
        </div>
      </div>

      {/* Talent Numbers */}
      <div className="mt-6 space-y-2">
        <h4 className="text-center text-cosmic-accent font-serif">
          {language === 'ru' ? 'Таланты и способности' :
           language === 'es' ? 'Talentos y habilidades' :
           'Talents and abilities'}
        </h4>
        <div className="flex justify-center space-x-3">
          {matrixData.talents.map((talent, index) => (
            <MatrixCell
              key={index}
              number={talent}
              type="talent"
              position={`talent${index + 1}`}
              onClick={handleCellClick}
              className="w-12 h-12 text-base"
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs text-cosmic-secondary mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-cosmic-accent/20 to-cosmic-accent/40 border border-cosmic-accent/40" />
          <span>{language === 'ru' ? 'Основные' : language === 'es' ? 'Básicos' : 'Basic'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-400/40" />
          <span>{language === 'ru' ? 'Кармические' : language === 'es' ? 'Kármicos' : 'Karmic'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-400/40" />
          <span>{language === 'ru' ? 'Таланты' : language === 'es' ? 'Talentos' : 'Talents'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40" />
          <span>{language === 'ru' ? 'Судьба' : language === 'es' ? 'Destino' : 'Destiny'}</span>
        </div>
      </div>

      {/* Detail Dialog */}
      {!isMobile && (
        <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
          <DialogContent className="bg-cosmic-dark/95 border-cosmic-accent/20 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-cosmic-accent">
              <Info className="w-5 h-5" />
              <span>
                {language === 'ru' ? 'Число' : language === 'es' ? 'Número' : 'Number'} {selectedNumber?.number}
              </span>
            </DialogTitle>
          </DialogHeader>
          {meaning && selectedNumber && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-white mb-2">
                  {getPositionName(selectedNumber.position)}
                </h4>
                <h5 className="text-cosmic-accent font-medium mb-2">
                  {meaning.title[language as keyof typeof meaning.title] || meaning.title.ru}
                </h5>
                <p className="text-cosmic-secondary text-sm leading-relaxed">
                  {meaning.description[language as keyof typeof meaning.description] || meaning.description.ru}
                </p>
              </div>
            </div>
          )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};