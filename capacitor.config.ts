import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asket.cosmicascension',
  appName: 'Asket: AI & Spiritual Pacts',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0A0A0F',
    },
    SafeArea: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A0A0F',
    },
  },
};

export default config;
