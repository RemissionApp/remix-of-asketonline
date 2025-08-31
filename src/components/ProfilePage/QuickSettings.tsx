import React from 'react';
import { Volume2, Globe, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SupportedLanguage } from '@/i18n/translations';

export const QuickSettings: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, userProfile } = useAppStore();
  const { t } = useTranslations();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };

  return (
    <div className="cosmic-block rounded-lg p-space-md mb-space-lg">
      <div className="flex items-center justify-between mb-space-md">
        <h3 className="text-cosmic-text font-medium">
          {t.userProfile?.quickSettings || 'Быстрые настройки'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/account-settings')}
          className="text-cosmic-accent hover:text-cosmic-accent/80"
        >
          <Settings className="w-4 h-4 mr-2" />
          {t.userProfile?.allSettings || 'Все'}
        </Button>
      </div>

      <div className="space-y-space-md">
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
      </div>
    </div>
  );
};