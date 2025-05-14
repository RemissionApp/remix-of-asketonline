
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { SupportedLanguage } from '@/i18n/translations';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const { setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const [isAnimated, setIsAnimated] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const languages: SupportedLanguage[] = ['ru', 'en', 'es'];
  
  // Current language for cycling
  const currentLang = languages[cycleIndex % languages.length];
  
  // Texts for different languages
  const subtitles = {
    ru: "Путь к внутренней силе",
    en: "The path to inner strength",
    es: "El camino hacia la fuerza interior"
  };
  
  const buttonTexts = {
    ru: "Начать путешествие",
    en: "Begin the journey",
    es: "Comenzar el viaje"
  };
  
  // Animation for component appearance
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimated(true);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Effect for language change every two seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex(prevIndex => prevIndex + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleContinue = () => {
    setActiveScreen('language');
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
      
      <div className={`relative z-10 text-center transition-all duration-1000 ${
        isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="w-56 h-56 mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-cosmic-accent/10 animate-pulse-slow"></div>
          <div className="absolute inset-4 rounded-full bg-cosmic-accent/20 animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-8 rounded-full bg-cosmic-accent/30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-12 rounded-full bg-cosmic-accent/40 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute inset-16 rounded-full bg-cosmic-accent/50 animate-circle-expand"></div>
        </div>
        
        <h1 className="text-5xl font-serif text-white mb-6 cosmic-gradient-text">
          {t?.welcome?.title || "ASKET"}
        </h1>
        
        <p className="text-2xl text-cosmic-secondary mb-12 transition-all duration-300 ease-in-out">
          {subtitles[currentLang]}
        </p>
        
        <Link to="/language">
          <CosmicButton onClick={handleContinue} size="lg" className="transition-all duration-300 ease-in-out">
            {buttonTexts[currentLang]}
          </CosmicButton>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
