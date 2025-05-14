
import React from 'react';

interface AdditionalInfoProps {
  additionalInfo: {
    lucky_number: string;
    lucky_time: string;
    color: string;
    mood: string;
  };
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ additionalInfo }) => {
  return (
    <div className="mt-8 bg-cosmic-accent/5 rounded-lg p-4 border border-cosmic-accent/20">
      <h3 className="text-cosmic-gold text-center mb-3">Дополнительно</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent">🎲</span>
          <span className="text-cosmic-secondary">Счастливое число:</span>
          <span className="text-white">{additionalInfo.lucky_number}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent">🕒</span>
          <span className="text-cosmic-secondary">Время удачи:</span>
          <span className="text-white">{additionalInfo.lucky_time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent">🎨</span>
          <span className="text-cosmic-secondary">Цвет дня:</span>
          <span className="text-white">{additionalInfo.color}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent">💫</span>
          <span className="text-cosmic-secondary">Настроение:</span>
          <span className="text-white">{additionalInfo.mood}</span>
        </div>
      </div>
    </div>
  );
};
