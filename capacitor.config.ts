import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asket.cosmicascension',
  appName: 'Cosmic Ascension Path',
  webDir: 'dist',
  server: {
    url: 'http://192.168.1.104:8080',
    cleartext: true,
  },
  plugins: {
    LiveUpdates: {
      appId: 'com.asket.cosmicascension',
      channel: 'development',
    },
    Purchases: {
      appId: 'com.asket.cosmicascension',
    },
  },
};

export default config;
