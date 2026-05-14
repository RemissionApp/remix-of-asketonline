import React, { useEffect, useRef } from 'react';
import galaxyBg from '@/assets/cosmic-galaxy-bg.jpg';

/**
 * Mystical galaxy backdrop for desktop pages.
 * - Slow autonomous drift of the nebula
 * - Subtle scroll-based parallax for nebula + a faster star layer
 * - Respects prefers-reduced-motion
 */
export const GalaxyParallax: React.FC = () => {
  const nebulaRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let raf = 0;
    const update = () => {
      const shellScroller = document.querySelector<HTMLElement>('[data-scroll-container]');
      const y = shellScroller?.scrollTop ?? window.scrollY ?? 0;
      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `translate3d(0, ${y * 0.06}px, 0) scale(1.08)`;
      }
      if (starsRef.current) {
        starsRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };
    update();
    const shellScroller = document.querySelector<HTMLElement>('[data-scroll-container]');
    const scrollTarget: HTMLElement | Window = shellScroller ?? window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scrollTarget.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes galaxy-drift {
          0%   { transform: translate3d(0,    0,    0) scale(1.08); }
          50%  { transform: translate3d(-1.6%,-1.2%,0) scale(1.12); }
          100% { transform: translate3d(0,    0,    0) scale(1.08); }
        }
        @keyframes star-twinkle-slow {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }
        .galaxy-nebula { animation: galaxy-drift 80s ease-in-out infinite; }
        .galaxy-stars  { animation: star-twinkle-slow 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .galaxy-nebula, .galaxy-stars { animation: none !important; }
        }
      `}</style>

      {/* Nebula layer */}
      <div
        ref={nebulaRef}
        className="galaxy-nebula absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${galaxyBg})`,
          backgroundSize: 'cover',
          opacity: 0.65,
          imageRendering: 'auto',
        }}
      />

      {/* Soft star drift overlay (CSS radial dots) */}
      <div
        ref={starsRef}
        className="galaxy-stars absolute inset-0 will-change-transform"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.9), transparent 60%),' +
            'radial-gradient(1.5px 1.5px at 70% 60%, rgba(255,255,255,0.85), transparent 60%),' +
            'radial-gradient(1px 1px at 40% 80%, rgba(200,180,255,0.85), transparent 60%),' +
            'radial-gradient(1px 1px at 85% 20%, rgba(255,220,255,0.8), transparent 60%),' +
            'radial-gradient(1.2px 1.2px at 10% 70%, rgba(255,255,255,0.7), transparent 60%)',
          backgroundSize: '600px 600px, 700px 700px, 500px 500px, 800px 800px, 650px 650px',
          opacity: 0.7,
        }}
      />

      {/* Cinematic vignette + dim overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/55 via-cosmic-dark/35 to-cosmic-dark/85" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(7, 4, 23, 0.85) 100%)',
        }}
      />
    </div>
  );
};