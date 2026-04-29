import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asket.cosmicascension',
  appName: 'Asket: AI & Spiritual Pacts',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'app.lovable.5484cc75896e42e9a5fffef3bd09c812',
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: 'rgba(10, 10, 15, 0.8)',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A0A0F',
    },
  },
};

export default config;
