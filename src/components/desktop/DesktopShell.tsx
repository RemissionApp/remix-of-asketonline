import React from 'react';
import { useLocation } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { GalaxyParallax } from './GalaxyParallax';
import { useIsDesktop } from '@/hooks/useIsDesktop';

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
    <div className="hidden lg:flex min-h-screen w-full relative bg-cosmic-dark">
      <GalaxyParallax />
      <DesktopSidebar />
      <main data-scroll-container className="flex-1 min-w-0 overflow-y-auto relative z-10">
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
