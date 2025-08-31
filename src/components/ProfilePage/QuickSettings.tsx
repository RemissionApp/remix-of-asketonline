import React from 'react';
import { Volume2, Globe, Bell } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SupportedLanguage } from '@/i18n/translations';
import { SettingsGroup } from './SettingsGroup';

export const QuickSettings: React.FC = () => {
  const { language, setLanguage, userProfile } = useAppStore();
  const { t } = useTranslations();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };

  return (
    <SettingsGroup 
      title={t.userProfile?.quickSettings || 'Быстрые настройки'}
      fullSettingsText={t.userProfile?.allSettings || 'Все'}
    >
      {/* Language Setting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cosmic-accent" />
          <span className="text-sm text-cosmic-text">
            {t.userProfile?.languageLabel || 'Язык'}
          </span>
        </div>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-24 h-8 bg-cosmic-accent/10 border-cosmic-accent/30">
            <SelectValue>
              {language === 'en' ? '🇬🇧' : language === 'es' ? '🇪🇸' : '🇷🇺'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-cosmic-dark border-cosmic-accent/30">
            <SelectItem value="en" className="text-white hover:bg-cosmic-accent/20">
              🇬🇧 EN
            </SelectItem>
            <SelectItem value="es" className="text-white hover:bg-cosmic-accent/20">
              🇪🇸 ES
            </SelectItem>
            <SelectItem value="ru" className="text-white hover:bg-cosmic-accent/20">
              🇷🇺 RU
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sound Setting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cosmic-accent" />
          <span className="text-sm text-cosmic-text">
            {t.userProfile?.soundEnabled || 'Звук'}
          </span>
        </div>
        <Switch defaultChecked className="data-[state=checked]:bg-cosmic-accent" />
      </div>

      {/* Notifications Setting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cosmic-accent" />
          <span className="text-sm text-cosmic-text">
            {t.userProfile?.notifications || 'Уведомления'}
          </span>
        </div>
        <Switch defaultChecked className="data-[state=checked]:bg-cosmic-accent" />
      </div>
    </SettingsGroup>
  );
};