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
import { usePlatform } from '@/hooks/usePlatform';
import { isAndroid } from '@/utils/platform';

export const BottomNavigation = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, language, setActiveScreen, user } = useAppStore();
  const { t } = useTranslations();
  const { hasActiveSubscription } = useRevenueCat(user?.id);
  const { isIOS, isWeb, supportsSafeArea } = usePlatform();

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
      className="fixed left-0 right-0 z-[100] w-full pointer-events-none"
      style={{
        bottom: isAndroid()
          ? 'calc(env(safe-area-inset-bottom) + 1.4rem)'
          : 'calc(env(safe-area-inset-bottom) + 0.6rem)',
        paddingLeft: 'calc(env(safe-area-inset-left) + 0.6rem)',
        paddingRight: 'calc(env(safe-area-inset-right) + 0.6rem)',
      }}
    >
      <div className="flex justify-center pointer-events-auto">
        <div className="w-full max-w-3xl mx-auto">
          <div className="glass-strong glass-shimmer relative rounded-3xl flex justify-around items-center py-2 px-1 overflow-hidden">
            {/* Path button - Visible for both PRO and free users */}
            <NavItem
              active={isActive('/main')}
              onClick={() => handleNavigation('main', '/main')}
              icon={<Home size={20} />}
              label={t.main.nav.path || 'Path'}
            />

            {/* Ascesis button - Visible for both PRO and free users */}
            <NavItem
              active={isActive('/create-pact')}
              onClick={() => handleNavigation('create-pact', '/create-pact')}
              icon={<Sparkles size={20} />}
              label={t.main.nav.ascesis || 'Ascesis'}
            />

            {/* Different navigation options based on PRO status */}
            {isPro ? (
              <>
                <NavItem
                  active={isActive('/universe-call')}
                  onClick={() =>
                    handleNavigation('universe-call', '/universe-call')
                  }
                  icon={<Phone size={20} />}
                  label={
                    language === 'ru'
                      ? 'Звонок'
                      : language === 'es'
                        ? 'Llamada'
                        : 'Call'
                  }
                />
                <NavItem
                  active={isActive('/full-horoscope')}
                  onClick={() =>
                    handleNavigation('full-horoscope', '/full-horoscope')
                  }
                  icon={<Stars size={20} />}
                  label={
                    language === 'ru'
                      ? 'Гороскоп'
                      : language === 'es'
                        ? 'Horóscopo'
                        : 'Horoscope'
                  }
                />
              </>
            ) : (
              <NavItem
                active={isActive('/universe')}
                onClick={() => handleNavigation('universe', '/universe')}
                icon={<MessageSquare size={20} />}
                label={t.main.nav.universe || 'Universe'}
              />
            )}

            {/* Achievements button - Visible for both PRO and free users */}
            <NavItem
              active={isActive('/achievements')}
              onClick={() => handleNavigation('achievements', '/achievements')}
              icon={<Trophy size={20} />}
              label={
                language === 'ru'
                  ? 'Достижения'
                  : language === 'es'
                    ? 'Logros'
                    : 'Achievements'
              }
            />

            {/* Profile button - Visible for both PRO and free users */}
            <NavItem
              active={isActive('/profile')}
              onClick={() => handleNavigation('profile', '/profile')}
              icon={<UserRound size={20} />}
              label={t.main.nav.profile || 'Profile'}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="relative flex flex-col items-center justify-center px-2 py-1.5 transition-all duration-300 group"
  >
    <span
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
        active
          ? 'bg-gradient-to-br from-cosmic-accent/45 to-cosmic-indigo/35 border border-white/25 shadow-[0_0_18px_rgba(139,92,246,0.55)]'
          : 'border border-transparent group-hover:bg-white/5'
      }`}
    >
      <span
        className={`transition-colors duration-300 ${
          active ? 'text-white' : 'text-cosmic-secondary'
        }`}
      >
        {icon}
      </span>
    </span>
    <span
      className={`text-[10px] mt-0.5 tracking-wide transition-colors duration-300 ${
        active ? 'text-white' : 'text-cosmic-secondary/80'
      }`}
    >
      {label}
    </span>
  </button>
);
