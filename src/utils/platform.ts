import { Capacitor } from '@capacitor/core';

/**
 * Single source of truth for runtime platform detection.
 * Use these helpers everywhere instead of importing Capacitor directly,
 * so payment / native-only code paths stay consistent.
 */
export const isNativePlatform = (): boolean => Capacitor.isNativePlatform();
export const isWebPlatform = (): boolean => !Capacitor.isNativePlatform();
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  const p = Capacitor.getPlatform();
  if (p === 'ios' || p === 'android') return p;
  return 'web';
};