import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asket.cosmicascension',
  appName: 'Asket: AI & Spiritual Pacts',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'app.lovable.5484cc75896e42e9a5fffef3bd09c812',
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0d0d12',
    scrollEnabled: false,
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#0d0d12',
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#00000000',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0d0d12',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#c9a96e',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
