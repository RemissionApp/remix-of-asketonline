
import React from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { SupportedLanguage } from '@/i18n/translations';
import UserProfileForm from '@/components/UserProfileForm';

const LanguagePage: React.FC = () => {
  const { setActiveScreen, setLanguage } = useAppStore();
  const { t } = useTranslations();
  const [showProfileForm, setShowProfileForm] = React.useState(false);
  
  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];
  
  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setShowProfileForm(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />
      
      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 max-w-md w-full mx-auto">
        <Card className="cosmic-card backdrop-blur-lg bg-cosmic-dark/40">
          <CardContent className="pt-6">
            {!showProfileForm ? (
              <>
                <div className="flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-cosmic-accent mr-2" />
                  <h2 className="text-2xl font-serif text-white">Выберите язык / Select language / Seleccione idioma</h2>
                </div>
                
                <div className="flex flex-col space-y-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="flex items-center p-4 rounded-lg border border-cosmic-accent/30 bg-cosmic-dark/50 text-white hover:bg-cosmic-accent/20 transition-colors"
                      onClick={() => handleSelectLanguage(lang.code as SupportedLanguage)}
                    >
                      <span className="text-2xl mr-3">{lang.flag}</span>
                      <span className="text-lg">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <UserProfileForm />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguagePage;
