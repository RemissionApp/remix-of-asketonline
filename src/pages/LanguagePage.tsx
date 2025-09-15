import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { StarField } from '@/components/StarField';
import { SupportedLanguage } from '@/hooks/useTranslations';
import { getNavigationRoute } from '@/utils/authUtils';
import { useUserJourneyAnalytics } from '@/hooks/useUserJourneyAnalytics';

const LanguagePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, user, loadUserProfile } = useAppStore();
  const { trackJourneyStep } = useUserJourneyAnalytics();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(
    language as SupportedLanguage
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    trackJourneyStep('language_page_opened');
    
    // Check if user is already authenticated and has complete profile
    const checkAuthAndRedirect = async () => {
      if (user) {
        await loadUserProfile();
        const route = getNavigationRoute();
        console.log('LanguagePage - User authenticated, redirecting to:', route);
        trackJourneyStep('language_page_auth_redirect', { route });
        navigate(route);
      }
    };
    
    checkAuthAndRedirect();
  }, [user, loadUserProfile, navigate, trackJourneyStep]);

  const handleContinue = async () => {
    setLanguage(selectedLang);
    trackJourneyStep('language_selected', { language: selectedLang });

    // If user is already authenticated, determine correct route
    if (user) {
      await loadUserProfile();
      const route = getNavigationRoute();
      console.log('LanguagePage - handleContinue: User authenticated, redirecting to:', route);
      trackJourneyStep('continue_with_auth', { route });
      navigate(route);
    } else {
      // For non-authenticated users, always go to login
      trackJourneyStep('continue_to_login');
      navigate('/login');
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const getWelcomeText = () => {
    switch (selectedLang) {
      case 'ru':
        return 'Выберите язык приложения';
      case 'es':
        return 'Elige tu idioma';
      default:
        return 'Select your language';
    }
  };

  const getContinueText = () => {
    switch (selectedLang) {
      case 'ru':
        return 'Продолжить';
      case 'es':
        return 'Continuar';
      default:
        return 'Continue';
    }
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col items-center justify-center relative p-4">
      <StarField starCount={100} />

      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/10 to-cosmic-dark z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div
          className={`text-center transition-all duration-1000 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-4xl font-serif text-white mb-8">Asket</h1>

          <p className="text-white text-lg mb-12">{getWelcomeText()}</p>

          <div className="space-y-4 mb-12">
            {languages.map(lang => (
              <Button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code as SupportedLanguage)}
                className={`w-full py-6 justify-start text-left px-6 ${
                  selectedLang === lang.code
                    ? 'bg-cosmic-accent/40 hover:bg-cosmic-accent/50 border border-cosmic-accent text-white'
                    : 'bg-cosmic-dark/40 hover:bg-cosmic-dark/60 border border-cosmic-accent/30 text-white'
                }`}
              >
                <span className="text-2xl mr-4">{lang.flag}</span>
                <span className="text-lg">{lang.name}</span>
              </Button>
            ))}
          </div>

          <CosmicButton onClick={handleContinue} className="w-full">
            {getContinueText()}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;
