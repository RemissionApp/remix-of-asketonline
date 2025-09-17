import React from 'react';
import {
  usePlatform,
  usePlatformValue,
  usePlatformClasses,
} from '@/hooks/usePlatform';
import { isAndroid, logPlatformInfo } from '@/utils/platform';

export const PlatformDemo: React.FC = () => {
  const {
    platform,
    isIOS,
    isWeb,
    isNative,
    supportsSafeArea,
    supportsHaptic,
  } = usePlatform();

  const padding = usePlatformValue({
    ios: 20,
    android: 16,
    web: 8,
    default: 12,
  });

  const classes = usePlatformClasses({
    ios: 'text-blue-500 bg-blue-50',
    android: 'text-green-500 bg-green-50',
    web: 'text-purple-500 bg-purple-50',
    default: 'text-gray-500 bg-gray-50',
  });

  const handleLogInfo = () => {
    logPlatformInfo();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Platform Demo</h2>

      <div className={`p-4 rounded-lg ${classes}`}>
        <p>
          <strong>Platform:</strong> {platform}
        </p>
        <p>
          <strong>Is iOS:</strong> {isIOS ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Is Android:</strong> {isAndroid() ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Is Web:</strong> {isWeb ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Is Native:</strong> {isNative ? 'Yes' : 'No'}
        </p>
      </div>

      <div className="space-y-2">
        <p>
          <strong>Supports Safe Area:</strong> {supportsSafeArea ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Supports Haptic:</strong> {supportsHaptic ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Platform-specific padding:</strong> {padding}px
        </p>
      </div>

      <button
        onClick={handleLogInfo}
        className="px-4 py-2 bg-cosmic-accent text-white rounded-lg hover:bg-cosmic-accent2 transition-colors"
      >
        Log Platform Info to Console
      </button>

      <div className="text-sm text-gray-600">
        <p>This component demonstrates platform detection utilities.</p>
        <p>Check the console for detailed platform information.</p>
      </div>
    </div>
  );
};
