
import React from 'react';
import { cn } from '@/lib/utils';

interface PythagoreanMatrixProps {
  digits: Record<string, number>;
  language?: string;
}

export const PythagoreanMatrix: React.FC<PythagoreanMatrixProps> = ({ 
  digits, 
  language = 'ru' 
}) => {
  // Получаем значения для чисел в матрице
  const getMeaning = (num: string) => {
    const meanings: Record<string, Record<string, string>> = {
      '1': {
        ru: 'Сила Воли',
        en: 'Willpower',
        es: 'Fuerza de Voluntad'
      },
      '2': {
        ru: 'Интуиция',
        en: 'Intuition',
        es: 'Intuición'
      },
      '3': {
        ru: 'Знания',
        en: 'Knowledge',
        es: 'Conocimiento'
      },
      '4': {
        ru: 'Здоровье',
        en: 'Health',
        es: 'Salud'
      },
      '5': {
        ru: 'Харизма',
        en: 'Charisma',
        es: 'Carisma'
      },
      '6': {
        ru: 'Ответственность',
        en: 'Responsibility',
        es: 'Responsabilidad'
      },
      '7': {
        ru: 'Удача',
        en: 'Luck',
        es: 'Suerte'
      },
      '8': {
        ru: 'Организация',
        en: 'Organization',
        es: 'Organización'
      },
      '9': {
        ru: 'Интеллект',
        en: 'Intellect',
        es: 'Intelecto'
      }
    };
    
    return meanings[num][language as keyof typeof meanings[typeof num]] || meanings[num]['en'];
  };
  
  // Получаем цвет ячейки в зависимости от количества повторений цифры
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-cosmic-dark/70 text-cosmic-secondary/50';
    if (count === 1) return 'bg-cosmic-accent/10 text-cosmic-accent/80';
    if (count === 2) return 'bg-cosmic-accent/20 text-cosmic-accent';
    if (count >= 3) return 'bg-cosmic-accent/40 text-cosmic-accent font-bold';
    return '';
  };
  
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-3 gap-2">
        {/* Первый ряд */}
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['1'] || 0)
          )}
        >
          <div className="text-lg font-serif">1</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('1')}</div>
          {digits['1'] > 0 && <div className="text-xs mt-1">×{digits['1']}</div>}
        </div>
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['2'] || 0)
          )}
        >
          <div className="text-lg font-serif">2</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('2')}</div>
          {digits['2'] > 0 && <div className="text-xs mt-1">×{digits['2']}</div>}
        </div>
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['3'] || 0)
          )}
        >
          <div className="text-lg font-serif">3</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('3')}</div>
          {digits['3'] > 0 && <div className="text-xs mt-1">×{digits['3']}</div>}
        </div>
        
        {/* Второй ряд */}
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['4'] || 0)
          )}
        >
          <div className="text-lg font-serif">4</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('4')}</div>
          {digits['4'] > 0 && <div className="text-xs mt-1">×{digits['4']}</div>}
        </div>
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['5'] || 0)
          )}
        >
          <div className="text-lg font-serif">5</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('5')}</div>
          {digits['5'] > 0 && <div className="text-xs mt-1">×{digits['5']}</div>}
        </div>
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['6'] || 0)
          )}
        >
          <div className="text-lg font-serif">6</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('6')}</div>
          {digits['6'] > 0 && <div className="text-xs mt-1">×{digits['6']}</div>}
        </div>
        
        {/* Третий ряд */}
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['7'] || 0)
          )}
        >
          <div className="text-lg font-serif">7</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('7')}</div>
          {digits['7'] > 0 && <div className="text-xs mt-1">×{digits['7']}</div>}
        </div>
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['8'] || 0)
          )}
        >
          <div className="text-lg font-serif">8</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('8')}</div>
          {digits['8'] > 0 && <div className="text-xs mt-1">×{digits['8']}</div>}
        </div>
        <div 
          className={cn(
            "aspect-square flex flex-col items-center justify-center rounded-md p-2", 
            getCellColor(digits['9'] || 0)
          )}
        >
          <div className="text-lg font-serif">9</div>
          <div className="text-[10px] text-center mt-1">{getMeaning('9')}</div>
          {digits['9'] > 0 && <div className="text-xs mt-1">×{digits['9']}</div>}
        </div>
      </div>
    </div>
  );
};
