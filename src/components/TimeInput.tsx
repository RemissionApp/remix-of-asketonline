
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeInputProps {
  hours: number;
  minutes: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange
}) => {
  // Создаем массив часов от 0 до 23
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  
  // Создаем массив минут с шагом 5 (0, 5, 10, ..., 55)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);
  
  return (
    <div className="flex space-x-2">
      <div className="w-1/2">
        <Select
          value={hours.toString()}
          onValueChange={(value) => onHoursChange(parseInt(value))}
        >
          <SelectTrigger className="bg-cosmic-dark/40 border-cosmic-accent/30">
            <SelectValue placeholder="Часы" />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-dark border-cosmic-accent/30">
            {hourOptions.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-1/2">
        <Select
          value={minutes.toString()}
          onValueChange={(value) => onMinutesChange(parseInt(value))}
        >
          <SelectTrigger className="bg-cosmic-dark/40 border-cosmic-accent/30">
            <SelectValue placeholder="Минуты" />
          </SelectTrigger>
          <SelectContent className="bg-cosmic-dark border-cosmic-accent/30">
            {minuteOptions.map((minute) => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
