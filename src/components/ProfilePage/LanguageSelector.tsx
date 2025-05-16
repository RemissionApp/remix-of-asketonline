
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Globe } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SupportedLanguage } from '@/i18n/translations';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useAppStore();
  const { t } = useTranslations();
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };
  
  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Globe size={20} className="text-cosmic-accent" />
        <span className="text-white text-base font-sans">{t.userProfile?.languageLabel || "App language"}</span>
      </div>
      
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="bg-cosmic-dark/60 border-cosmic-accent/30 text-white font-sans">
          <SelectValue>
            {language === 'en' ? 'English 🇬🇧' : 
             language === 'es' ? 'Español 🇪🇸' : 
             'Русский 🇷🇺'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-cosmic-dark border-cosmic-accent/30">
          <SelectItem value="en" className="text-white hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer font-sans">
            <div className="flex items-center gap-2">
              <span>🇬🇧</span>
              <span>English</span>
            </div>
          </SelectItem>
          <SelectItem value="es" className="text-white hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer font-sans">
            <div className="flex items-center gap-2">
              <span>🇪🇸</span>
              <span>Español</span>
            </div>
          </SelectItem>
          <SelectItem value="ru" className="text-white hover:bg-cosmic-accent/20 focus:bg-cosmic-accent/20 cursor-pointer font-sans">
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
