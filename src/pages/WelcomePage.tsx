import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { SupportedLanguage } from '@/i18n/translations';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { user, checkOnboardingStatus } = useAppStore();
  const { isProfileComplete, isLoading } = useProfileCompletion();
  const [isAnimated, setIsAnimated] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const languages: SupportedLanguage[] = ['ru', 'en', 'es'];

  // Текущий язык для циклической смены
  const currentLang = languages[cycleIndex % languages.length];

  // Тексты для разных языков
  const subtitles = {
    ru: 'Путь к внутренней силе',
    en: 'The path to inner strength',
    es: 'El camino hacia la fuerza interior',
  };

  const buttonTexts = {
    ru: 'Начать путешествие',
    en: 'Begin the journey',
    es: 'Comenzar el viaje',
  };

  // Handle navigation for authenticated users
  useEffect(() => {
    if (!user) return;
    
    // Don't redirect if profile is still loading
    if (isLoading) {
      console.log('WelcomePage: Profile still loading, waiting...');
      return;
    }
    
    const isOnboarded = checkOnboardingStatus();
    
    console.log('WelcomePage: Navigation check', {
      hasUser: !!user,
      isProfileComplete,
      isOnboarded,
      isLoading
    });
    
    if (isOnboarded && isProfileComplete) {
      navigate('/main');
    } else if (!isProfileComplete) {
      navigate('/profile-setup');
    } else if (!isOnboarded) {
      navigate('/onboarding');
    }
  }, [user, isProfileComplete, isLoading, navigate, checkOnboardingStatus]);

  // Анимация появления компонентов
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // Эффект для смены языка каждые две секунды
  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex(prevIndex => prevIndex + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    navigate('/language');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />

      {/* Космический фон */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark" />

      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="w-56 h-56 mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-cosmic-accent/10 animate-pulse-slow"></div>
          <div
            className="absolute inset-4 rounded-full bg-cosmic-accent/20 animate-pulse-slow"
            style={{ animationDelay: '0.5s' }}
          ></div>
          <div
            className="absolute inset-8 rounded-full bg-cosmic-accent/30 animate-pulse-slow"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute inset-12 rounded-full bg-cosmic-accent/40 animate-pulse-slow"
            style={{ animationDelay: '1.5s' }}
          ></div>
          <div className="absolute inset-16 rounded-full bg-cosmic-accent/50 animate-circle-expand"></div>
        </div>

        <h1 className="text-5xl font-serif text-white mb-6 cosmic-gradient-text">
          Asket
        </h1>

        <p className="text-2xl text-cosmic-secondary mb-12 transition-all duration-300 ease-in-out">
          {subtitles[currentLang]}
        </p>

        <CosmicButton
          onClick={handleContinue}
          size="lg"
          className="transition-all duration-300 ease-in-out bg-transparent"
        >
          {buttonTexts[currentLang]}
        </CosmicButton>
      </div>
    </div>
  );
};

export default WelcomePage;
