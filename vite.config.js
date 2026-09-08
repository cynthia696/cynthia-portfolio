import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // Relative base so GitHub Pages (project or user site) resolves assets correctly.
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: {
    open: '/',
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        playground: 'ai-playground.html',
        atlas: 'gripp-rendezvoo.html',
        permissions: 'permissions.html',
        cropCircle: 'crop-circle-system.html',
        wiwant: 'wiwant.html',
      },
    },
  },
}));
