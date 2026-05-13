import React from 'react';
import { useLocation } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { StarField } from '@/components/StarField';
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
    <div className="hidden lg:flex min-h-screen w-full bg-cosmic-dark relative overflow-hidden">
      {/* Mystical galactic background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
        style={{ backgroundImage: `url(${galaxyBg})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/70 via-cosmic-dark/55 to-cosmic-dark/85 pointer-events-none"
      />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <StarField />
      </div>
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
