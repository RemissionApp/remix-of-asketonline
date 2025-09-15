import React, { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Sparkles,
  MessageSquare,
  Phone,
  Stars,
  UserRound,
  Trophy,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useRevenueCat } from '@/hooks/useRevenueCat';

export const BottomNavigation = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, language, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const { hasActiveSubscription } = useRevenueCat();

  // Check if a route is currently active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle navigation with screen tracking
  const handleNavigation = (
    screen:
      | 'main'
      | 'create-pact'
      | 'universe'
      | 'universe-call'
      | 'full-horoscope'
      | 'achievements'
      | 'profile',
    path: string
  ) => {
    // Update the active screen in the store
    setActiveScreen(screen);
    // Navigate to the corresponding route
    navigate(path);
  };

  // Check if user has PRO subscription
  const isPro = hasActiveSubscription;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] w-full bg-cosmic-dark/80 backdrop-blur-sm border-t border-cosmic-accent/20"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 2.7rem)',
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
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
                  onClick={() =>
                    handleNavigation('universe-call', '/universe-call')
                  }
                >
                  <Phone size={18} />
                  <span className="text-xs">
                    {language === 'ru'
                      ? 'Звонок'
                      : language === 'es'
                        ? 'Llamada'
                        : 'Call'}
                  </span>
                </button>

                {/* Full Horoscope button - Only visible for PRO users */}
                <button
                  className={`flex flex-col items-center p-1 ${isActive('/full-horoscope') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() =>
                    handleNavigation('full-horoscope', '/full-horoscope')
                  }
                >
                  <Stars size={18} />
                  <span className="text-xs">
                    {language === 'ru'
                      ? 'Гороскоп'
                      : language === 'es'
                        ? 'Horóscopo'
                        : 'Horoscope'}
                  </span>
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
                  <span className="text-xs">
                    {t.main.nav.universe || 'Universe'}
                  </span>
                </button>
              </>
            )}

            {/* Achievements button - Visible for both PRO and free users */}
            <button
              className={`flex flex-col items-center p-1 ${isActive('/achievements') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('achievements', '/achievements')}
            >
              <Trophy size={18} />
              <span className="text-xs">
                {language === 'ru'
                  ? 'Достижения'
                  : language === 'es'
                    ? 'Logros'
                    : 'Achievements'}
              </span>
            </button>

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
