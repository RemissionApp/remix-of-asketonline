import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import droneSrc from '@/assets/audio/cosmic-drone.mp3';

/**
 * Mounts a looping cosmic ambient drone while the component using this hook is alive.
 * Honors `ambientEnabled` and `ambientVolume` from the global store.
 * Performs a soft fade-in on play and fade-out on stop.
 */
export function useAmbientDrone(active: boolean = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const { ambientEnabled, ambientVolume } = useAppStore();

  // Lazy-create audio element
  useEffect(() => {
    const a = new Audio(droneSrc);
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0;
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = '';
      audioRef.current = null;
    };
  }, []);

  // Fade helper
  const fadeTo = (target: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRef.current) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
    fadeRef.current = window.setInterval(() => {
      const cur = a.volume;
      const step = 0.04;
      if (Math.abs(cur - target) <= step) {
        a.volume = target;
        if (target === 0) a.pause();
        if (fadeRef.current) {
          window.clearInterval(fadeRef.current);
          fadeRef.current = null;
        }
      } else {
        a.volume = cur < target ? cur + step : cur - step;
      }
    }, 60);
  };

  // React to active/enabled/volume changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const shouldPlay = active && ambientEnabled && ambientVolume > 0;
    if (shouldPlay) {
      void a.play().catch(() => {/* autoplay blocked; will start on next user gesture */});
      fadeTo(ambientVolume);
    } else {
      fadeTo(0);
    }
  }, [active, ambientEnabled, ambientVolume]);

  // Live volume update (without retriggering play)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (active && ambientEnabled) {
      a.volume = ambientVolume;
    }
  }, [ambientVolume, ambientEnabled, active]);
}