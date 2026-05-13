import React from 'react';
import { useLocation } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import galaxyBg from '@/assets/cosmic-galaxy-bg.jpg';

// Routes that get the sidebar shell on desktop
const SHELL_ROUTES = [
  '/main', '/universe-hub', '/universe', '/universe-chat', '/lyra', '/lyra-chat',
  '/cosmos', '/profile', '/pacts', '/create-pact', '/affirmations', '/cosmic-missions',
  '/numerology', '/achievements', '/detailed-horoscope', '/full-horoscope',
  '/account-settings', '/comparison', '/admin',
];

export const DesktopShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDesktop = useIsDesktop();
  const { pathname } = useLocation();
  const shouldShell = isDesktop && SHELL_ROUTES.some((p) => pathname.startsWith(p));

  if (!shouldShell) return <>{children}</>;

  return (
    <div className="hidden lg:flex min-h-screen w-full relative">
      {/* Mystical galactic background — layered above the page StarField */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{ backgroundImage: `url(${galaxyBg})`, opacity: 0.55 }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-cosmic-dark/65 via-cosmic-dark/45 to-cosmic-dark/85"
      />
      <DesktopSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto relative z-10">
        <div className="mx-auto w-full max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
};

// Desktop-only wrapper that lets mobile render its own layout
export const ResponsiveShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDesktop = useIsDesktop();
  const { pathname } = useLocation();
  const shouldShell = isDesktop && SHELL_ROUTES.some((p) => pathname.startsWith(p));
  if (shouldShell) return <DesktopShell>{children}</DesktopShell>;
  return <>{children}</>;
};
