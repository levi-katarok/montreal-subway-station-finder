import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: '.',
  build: {
    outDir: '../../dist/client',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      // Ignore files that could cause rebuild loops
      ignored: [
        '**/node_modules/**',
        '**/.turbo/**',
        '**/dist/**',
        '**/build/**',
        '**/.git/**',
        // Ignore other workspace apps to prevent cross-triggering
        '../../apps/api/**',
        '../../server/**',
        // Ignore documentation and config files
        '**/*.md',
        '**/turbo.json',
        '**/package.json',
        '**/package-lock.json',
        '**/bun.lockb',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
