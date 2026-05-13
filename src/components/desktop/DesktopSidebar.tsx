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
          className="group relative mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white font-medium text-sm overflow-visible
                     bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-700
                     hover:from-violet-500 hover:via-fuchsia-500 hover:to-indigo-600
                     border border-fuchsia-300/40
                     shadow-[0_0_25px_rgba(168,85,247,0.55),0_0_60px_rgba(139,92,246,0.30)]
                     transition-all duration-300"
        >
          {/* Outer mystic glow */}
          <span className="pointer-events-none absolute -inset-1 rounded-xl bg-fuchsia-400/15 blur-md animate-pulse" />
          {/* Soft pulsing ring */}
          <span className="pointer-events-none absolute inset-0 rounded-xl border border-fuchsia-300/40 animate-ping [animation-duration:2.6s]" />
          <Phone size={16} className="relative z-10" />
          <span className="relative z-10 font-serif tracking-wide">
            {tr(language, 'Позвонить Вселенной', 'Call Lyra', 'Llamar a Lyra')}
          </span>
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
