
import React, { memo } from 'react';
import { Home, Sparkles, MessageSquare, UserRound, Stars, Phone } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOptimizedTextToSpeech } from '@/hooks/useOptimizedTextToSpeech';

// Define a mapping between route paths and ActiveScreen values
const routeToScreenMapping: Record<string, 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation' | 'login' | 'signup' | 'universe-call' | 'full-horoscope' | 'numerology'> = {
  '/main': 'main',
  '/create-pact': 'create-pact',
  '/universe': 'universe',
  '/universe-call': 'universe-call',
  '/profile': 'profile',
  '/comparison': 'comparison',
  '/meditation': 'meditation',
  '/full-horoscope': 'full-horoscope',
  '/numerology': 'numerology'
};

export const BottomNavigation: React.FC = memo(() => {
  const { setActiveScreen, activeScreen, userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const location = useLocation();
  const { generateAndPlaySpeech } = useOptimizedTextToSpeech();
  
  // Helper to determine which screen is active based on URL
  const isActive = (path: string) => location.pathname === path;
  
  // Function to get navigation phrases based on destination
  const getNavigationPhrase = (destination: string) => {
    switch(destination) {
      case '/main':
        switch(language) {
          case 'ru': return 'Переходим к главной странице. Здесь вы найдете свой духовный путь.';
          case 'es': return 'Vamos a la página principal. Aquí encontrarás tu camino espiritual.';
          default: return 'Going to the main page. Here you will find your spiritual path.';
        }
      case '/create-pact':
        // Отключаем голосовое сопровождение для навигации на страницу создания аскезы
        return '';
      case '/universe-call':
        switch(language) {
          case 'ru': return 'Переходим к звонку со Вселенной. Поговорите с космической мудростью голосом.';
          case 'es': return 'Vamos a la llamada con el Universo. Habla con la sabiduría cósmica por voz.';
          default: return 'Going to Universe call. Speak with cosmic wisdom by voice.';
        }
      case '/universe':
        switch(language) {
          case 'ru': return 'Переходим к вопросу Вселенной. Получите мудрость от высших сил.';
          case 'es': return 'Vamos a la pregunta del Universo. Obtén sabiduría de las fuerzas superiores.';
          default: return 'Going to Universe question. Get wisdom from higher forces.';
        }
      case '/full-horoscope':
        switch(language) {
          case 'ru': return 'Переходим к полному гороскопу. Узнайте что говорят звезды о вашем будущем.';
          case 'es': return 'Vamos al horóscopo completo. Descubre lo que las estrellas dicen sobre tu futuro.';
          default: return 'Going to full horoscope. Discover what the stars say about your future.';
        }
      case '/profile':
        switch(language) {
          case 'ru': return 'Переходим к профилю. Управляйте своими настройками и подпиской.';
          case 'es': return 'Vamos al perfil. Gestiona tu configuración y suscripción.';
          default: return 'Going to profile. Manage your settings and subscription.';
        }
      default:
        return '';
    }
  };
  
  // Updated to match the ActiveScreen type
  const handleNavigation = async (screen: 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation' | 'login' | 'signup' | 'universe-call' | 'full-horoscope' | 'numerology', path: string) => {
    // Update the active screen in the store
    setActiveScreen(screen);
    // Navigate to the corresponding route
    navigate(path);
    
    // Play navigation phrase in background (только если фраза не пустая)
    const phrase = getNavigationPhrase(path);
    if (phrase) {
      try {
        generateAndPlaySpeech(phrase, { 
          voice: 'Custom', 
          model: 'eleven_multilingual_v2' 
        });
      } catch (error) {
        console.error('Error playing navigation phrase:', error);
      }
    }
  };
  
  // Check if user has PRO subscription
  const isPro = userProfile?.isPro || false;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 w-full bg-cosmic-dark/80 backdrop-blur-sm border-t border-cosmic-accent/20 pb-safe-bottom">
      <div className="flex justify-center">
        <div className="w-full px-2">
          <div className="flex justify-around items-center py-1 max-w-3xl mx-auto">
            {/* Path button - Visible for both PRO and free users */}
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/main') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('main', '/main')}
            >
              <Home size={18} />
              <span className="text-xs">{t.main.nav.path || 'Path'}</span>
            </button>
            
            {/* Ascesis button - Visible for both PRO and free users */}
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/create-pact') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('create-pact', '/create-pact')}
            >
              <Sparkles size={18} />
              <span className="text-xs">{t.main.nav.ascesis || 'Ascesis'}</span>
            </button>
            
            {/* Different navigation options based on PRO status */}
            {isPro ? (
              <>
                {/* Call button - Only visible for PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/universe-call') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('universe-call', '/universe-call')}
                >
                  <Phone size={18} />
                  <span className="text-xs">{t.main.nav.universeCall || 'Call'}</span>
                </button>
                
                {/* Full Horoscope button - Only visible for PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/full-horoscope') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('full-horoscope', '/full-horoscope')}
                >
                  <Stars size={18} />
                  <span className="text-xs">{language === 'ru' ? 'Гороскоп' : language === 'es' ? 'Horóscopo' : 'Horoscope'}</span>
                </button>
              </>
            ) : (
              <>
                {/* Universe question button - Only visible for free users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/universe') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('universe', '/universe')}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs">{t.main.nav.universe || 'Universe'}</span>
                </button>
              </>
            )}
            
            {/* Profile button - Visible for both PRO and free users */}
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/profile') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('profile', '/profile')}
            >
              <UserRound size={18} />
              <span className="text-xs">{t.main.nav.profile || 'Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
