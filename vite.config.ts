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
          // Keep React, react-dom, router, and react-query together to avoid
          // cross-chunk init order issues (react-query reads React.useEffect at module load).
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
          ],
          'supabase-vendor': ['@supabase/supabase-js'],
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
