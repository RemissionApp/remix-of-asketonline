import { useMemo } from 'react';
import {
  getPlatform,
  getPlatformInfo,
  Platform,
  supportsFeature,
} from '@/utils/platform';

/**
 * Хук для определения платформы в React компонентах
 */
export const usePlatform = () => {
  return useMemo(() => {
    const platform = getPlatform();
    const info = getPlatformInfo();

    return {
      platform,
      ...info,
      supportsSafeArea: supportsFeature('safe-area'),
      supportsHaptic: supportsFeature('haptic'),
      supportsNativeSharing: supportsFeature('native-sharing'),
      supportsCamera: supportsFeature('camera'),
    };
  }, []);
};

/**
 * Хук для получения платформо-специфичных значений
 */
export const usePlatformValue = <T>(values: {
  ios?: T;
  android?: T;
  web?: T;
  default?: T;
}): T | undefined => {
  return useMemo(() => {
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
  }, [values.ios, values.android, values.web, values.default]);
};

/**
 * Хук для получения платформо-специфичных CSS классов
 */
export const usePlatformClasses = (classes: {
  ios?: string;
  android?: string;
  web?: string;
  default?: string;
}): string => {
  return useMemo(() => {
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
  }, [classes.ios, classes.android, classes.web, classes.default]);
};

/**
 * Хук для условного выполнения кода в зависимости от платформы
 */
export const usePlatformSpecific = <T>(callbacks: {
  ios?: () => T;
  android?: () => T;
  web?: () => T;
  default?: () => T;
}): T | undefined => {
  return useMemo(() => {
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
  }, [callbacks.ios, callbacks.android, callbacks.web, callbacks.default]);
};
