import { Capacitor } from '@capacitor/core';

export type Platform = 'ios' | 'android' | 'web';

/**
 * Определяет текущую платформу
 * @returns 'ios' | 'android' | 'web'
 */
export const getPlatform = (): Platform => {
  if (Capacitor.isNativePlatform()) {
    return Capacitor.getPlatform() as Platform;
  }
  return 'web';
};

/**
 * Проверяет, является ли платформа iOS
 */
export const isIOS = (): boolean => {
  return getPlatform() === 'ios';
};

/**
 * Проверяет, является ли платформа Android
 */
export const isAndroid = (): boolean => {
  return getPlatform() === 'android';
};

/**
 * Проверяет, является ли платформа веб
 */
export const isWeb = (): boolean => {
  return getPlatform() === 'web';
};

/**
 * Проверяет, является ли платформа нативной (iOS или Android)
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Получает информацию о платформе в виде объекта
 */
export const getPlatformInfo = () => {
  const platform = getPlatform();

  return {
    platform,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isWeb: platform === 'web',
    isNative: platform !== 'web',
  };
};

/**
 * Выполняет код в зависимости от платформы
 * @param callbacks - объект с колбэками для каждой платформы
 */
export const platformSpecific = <T>(callbacks: {
  ios?: () => T;
  android?: () => T;
  web?: () => T;
  default?: () => T;
}): T | undefined => {
  const platform = getPlatform();

  switch (platform) {
    case 'ios':
      return callbacks.ios?.() ?? callbacks.default?.();
    case 'android':
      return callbacks.android?.() ?? callbacks.default?.();
    case 'web':
      return callbacks.web?.() ?? callbacks.default?.();
    default:
      return callbacks.default?.();
  }
};

/**
 * Получает CSS классы в зависимости от платформы
 * @param classes - объект с классами для каждой платформы
 */
export const getPlatformClasses = (classes: {
  ios?: string;
  android?: string;
  web?: string;
  default?: string;
}): string => {
  const platform = getPlatform();

  switch (platform) {
    case 'ios':
      return classes.ios ?? classes.default ?? '';
    case 'android':
      return classes.android ?? classes.default ?? '';
    case 'web':
      return classes.web ?? classes.default ?? '';
    default:
      return classes.default ?? '';
  }
};

/**
 * Получает значения в зависимости от платформы
 * @param values - объект со значениями для каждой платформы
 */
export const getPlatformValue = <T>(values: {
  ios?: T;
  android?: T;
  web?: T;
  default?: T;
}): T | undefined => {
  const platform = getPlatform();

  switch (platform) {
    case 'ios':
      return values.ios ?? values.default;
    case 'android':
      return values.android ?? values.default;
    case 'web':
      return values.web ?? values.default;
    default:
      return values.default;
  }
};

/**
 * Проверяет, поддерживает ли платформа определенную функцию
 */
export const supportsFeature = (
  feature: 'safe-area' | 'haptic' | 'native-sharing' | 'camera'
): boolean => {
  const platform = getPlatform();

  switch (feature) {
    case 'safe-area':
      return (
        platform === 'ios' ||
        (platform === 'android' && Capacitor.getPlatform() !== 'web')
      );
    case 'haptic':
      return platform !== 'web';
    case 'native-sharing':
      return platform !== 'web';
    case 'camera':
      return platform !== 'web';
    default:
      return false;
  }
};

/**
 * Логирует информацию о платформе (для отладки)
 */
export const logPlatformInfo = (): void => {
  const info = getPlatformInfo();
  console.log('Platform Info:', {
    ...info,
    capacitorPlatform: Capacitor.getPlatform(),
    isNative: Capacitor.isNativePlatform(),
    userAgent:
      typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
  });
};
