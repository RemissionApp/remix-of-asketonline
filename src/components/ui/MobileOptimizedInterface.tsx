import React, { useEffect } from 'react';

interface MobileOptimizedInterfaceProps {
  children: React.ReactNode;
}

export const MobileOptimizedInterface: React.FC<
  MobileOptimizedInterfaceProps
> = ({ children }) => {
  useEffect(() => {
    // Prevent zoom on input focus for iOS
    const handleFocus = (e: FocusEvent) => {
      if (window.innerWidth < 768) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          );
        }
      }
    };

    const handleBlur = (e: FocusEvent) => {
      if (window.innerWidth < 768) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no'
          );
        }
      }
    };

    // Add haptic feedback support
    const addHapticFeedback = (element: HTMLElement) => {
      element.addEventListener('touchstart', () => {
        if ('vibrate' in navigator && window.innerWidth < 768) {
          navigator.vibrate(10); // Short vibration on touch
        }
      });
    };

    // Add haptic feedback to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(addHapticFeedback);

    // Pull-to-refresh is prevented natively via `overscroll-behavior: none`
    // in src/styles/base.css. No JS touch listeners needed here — they
    // previously broke scroll inside nested scroll containers (desktop shell).
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return <>{children}</>;
};
