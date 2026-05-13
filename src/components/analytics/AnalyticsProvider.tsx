import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/hooks/useAnalytics';
import { useAppStore } from '@/store/useAppStore';

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { language } = useAppStore();
  const lastPath = useRef<string | null>(null);
  const lastTime = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const prev = lastPath.current;
    const duration = prev ? now - lastTime.current : undefined;
    // Send the previous page view duration first
    if (prev) trackPageView(prev, duration, language);
    // Then mark the new one
    lastPath.current = location.pathname;
    lastTime.current = now;
    trackPageView(location.pathname, undefined, language);

    const onUnload = () => {
      if (lastPath.current) {
        trackPageView(lastPath.current, Date.now() - lastTime.current, language);
      }
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [location.pathname, language]);

  return <>{children}</>;
};
