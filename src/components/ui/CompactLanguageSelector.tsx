import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SupportedLanguage } from '@/i18n/translations';

export const CompactLanguageSelector: React.FC = () => {
  const { language, setLanguage } = useAppStore();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-cosmic-accent" />
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-auto bg-cosmic-dark/60 border-cosmic-accent/30 text-cosmic-text hover:bg-cosmic-accent/10 h-8 px-3">
          <SelectValue>
            {language === 'en'
              ? '🇬🇧'
              : language === 'es'
                ? '🇪🇸'
                : '🇷🇺'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-cosmic-dark border-cosmic-accent/30">
          <SelectItem
            value="en"
            className="text-cosmic-text hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>🇬🇧</span>
              <span>English</span>
            </div>
          </SelectItem>
          <SelectItem
            value="es"
            className="text-cosmic-text hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>🇪🇸</span>
              <span>Español</span>
            </div>
          </SelectItem>
          <SelectItem
            value="ru"
            className="text-cosmic-text hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>🇷🇺</span>
              <span>Русский</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};