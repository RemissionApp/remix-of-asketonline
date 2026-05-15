import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'revenuecat-vendor': [
            '@revenuecat/purchases-capacitor',
            '@revenuecat/purchases-capacitor-ui',
          ],
          'charts-vendor': ['recharts'],
          'capacitor-vendor': [
            '@capacitor/core',
            '@capacitor/app',
            '@capacitor/preferences',
            '@capacitor/push-notifications',
            '@capacitor/status-bar',
            '@capacitor-community/apple-sign-in',
          ],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            'lucide-react',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}));
