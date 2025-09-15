import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asket.cosmicascension',
  appName: 'Cosmic Ascension Path',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#16002A',
    },
    SafeArea: {
      enabled: true,
    },
  },
};

export default config;
