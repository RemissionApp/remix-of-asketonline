import React, { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Phone, Target, Stars, UserRound } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { usePlatform } from '@/hooks/usePlatform';
import { isAndroid } from '@/utils/platform';

export const BottomNavigation = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useAppStore();
  usePlatform();

  const isActive = (path: string) => location.pathname === path;
  const tr = (ru: string, en: string, es: string) =>
    language === 'ru' ? ru : language === 'es' ? es : en;

  const items = [
    { path: '/main', icon: <Home size={20} />, label: tr('Главная', 'Home', 'Inicio') },
    {
      path: '/universe-call',
      icon: <Phone size={20} />,
      label: tr('Вселенная', 'Lyra', 'Lyra'),
    },
    {
      path: '/cosmic-missions',
      icon: <Target size={20} />,
      label: tr('Миссии', 'Missions', 'Misiones'),
    },
    {
      path: '/cosmos',
      icon: <Stars size={20} />,
      label: tr('Космос', 'Cosmos', 'Cosmos'),
    },
    {
      path: '/profile',
      icon: <UserRound size={20} />,
      label: tr('Профиль', 'Profile', 'Perfil'),
    },
  ];

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
            {items.map(item => (
              <NavItem
                key={item.path}
                active={isActive(item.path)}
                onClick={() => navigate(item.path)}
                icon={item.icon}
                label={item.label}
              />
            ))}
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
