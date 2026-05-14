import { Capacitor } from '@capacitor/core';

export type Platform = 'ios' | 'android' | 'web';

export interface PlatformInfo {
  isNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  platform: Platform;
}

export const getPlatform = (): Platform => {
  const p = Capacitor.getPlatform();
  if (p === 'ios' || p === 'android') return p;
  return 'web';
};

export const isNativePlatform = (): boolean => Capacitor.isNativePlatform();
export const isWebPlatform = (): boolean => !Capacitor.isNativePlatform();
export const isIOS = (): boolean => getPlatform() === 'ios';
export const isAndroid = (): boolean => getPlatform() === 'android';
export const isWeb = (): boolean => getPlatform() === 'web';

export const getPlatformInfo = (): PlatformInfo => {
  const platform = getPlatform();
  return {
    isNative: Capacitor.isNativePlatform(),
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isWeb: platform === 'web',
    platform,
  };
};

export type PlatformFeature =
  | 'safe-area'
  | 'haptic'
  | 'native-sharing'
  | 'camera'
  | 'native-payments';

export const supportsFeature = (feature: PlatformFeature): boolean => {
  const native = Capacitor.isNativePlatform();
  switch (feature) {
    case 'safe-area':
    case 'haptic':
    case 'camera':
    case 'native-payments':
      return native;
    case 'native-sharing':
      return native || (typeof navigator !== 'undefined' && 'share' in navigator);
    default:
      return false;
  }
};

export const logPlatformInfo = (): void => {
  // eslint-disable-next-line no-console
  console.info('[platform]', getPlatformInfo());
};
