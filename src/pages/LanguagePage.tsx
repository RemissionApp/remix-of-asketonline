
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';

const LanguagePage: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage } = useAppStore();
  
  const handleLanguageSelect = (language: 'ru' | 'en' | 'es') => {
    setLanguage(language);
    navigate('/login'); // Теперь перенаправляем на страницу входа
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
      
      <div className="relative z-10 max-w-md w-full mx-auto px-4">
        <h1 className="text-4xl font-serif text-white text-center mb-8">Выберите язык</h1>
        <Card className="cosmic-card backdrop-blur-lg bg-cosmic-dark/40">
          <CardContent className="pt-6 space-y-4">
            <Button
              onClick={() => handleLanguageSelect('ru')}
              className="w-full py-6 text-lg bg-cosmic-dark/70 hover:bg-cosmic-accent/60 text-white font-medium border border-cosmic-accent/30"
            >
              Русский
            </Button>
            <Button
              onClick={() => handleLanguageSelect('en')}
              className="w-full py-6 text-lg bg-cosmic-dark/70 hover:bg-cosmic-accent/60 text-white font-medium border border-cosmic-accent/30"
            >
              English
            </Button>
            <Button
              onClick={() => handleLanguageSelect('es')}
              className="w-full py-6 text-lg bg-cosmic-dark/70 hover:bg-cosmic-accent/60 text-white font-medium border border-cosmic-accent/30"
            >
              Español
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguagePage;
