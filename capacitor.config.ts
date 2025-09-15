import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asket.cosmicascension',
  appName: 'Asket: AI & Spiritual Pacts',
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
