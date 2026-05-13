import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, ScrollText, Stars, UserRound, Phone, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const tr = (lang: string, ru: string, en: string, es: string) =>
  lang === 'ru' ? ru : lang === 'es' ? es : en;

export const DesktopSidebar: React.FC = () => {
  const { language, pacts } = useAppStore();
  const isAdmin = useIsAdmin();
  const items = [
    { path: '/main', icon: Home, label: tr(language, 'Главная', 'Home', 'Inicio') },
    { path: '/universe-hub', icon: Sparkles, label: tr(language, 'Вселенная', 'Lyra', 'Lyra') },
    ...(pacts && pacts.length > 0
      ? [{ path: '/pacts', icon: ScrollText, label: tr(language, 'Аскезы', 'Ascesis', 'Ascesis') }]
      : []),
    { path: '/cosmos', icon: Stars, label: tr(language, 'Космос', 'Cosmos', 'Cosmos') },
    { path: '/profile', icon: UserRound, label: tr(language, 'Профиль', 'Profile', 'Perfil') },
  ];
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white/[0.03] backdrop-blur-2xl border-r border-white/10 px-4 py-6 z-40">
      <div className="flex items-center gap-2 px-2 mb-8">
        <img src="/asket-logo.png" alt="Asceta" className="w-9 h-9 rounded-full" />
        <span className="font-serif text-xl text-white">Asceta</span>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${
                isActive
                  ? 'bg-cosmic-accent/25 text-white border border-cosmic-accent/40'
                  : 'text-cosmic-secondary hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/lyra/call"
          className="mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-sm hover:from-emerald-400 hover:to-emerald-500 transition-colors"
        >
          <Phone size={16} />
          <span>{tr(language, 'Позвонить', 'Call', 'Llamar')}</span>
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm border ${
                isActive
                  ? 'bg-cosmic-gold/25 text-cosmic-gold border-cosmic-gold/40'
                  : 'text-cosmic-secondary border-transparent hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Shield size={18} />
            <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};
