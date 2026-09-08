import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Classic <script> / fetch() assets Vite does not emit — copy into dist for Pages. */
function copyRuntimeAssets() {
  const copies = [
    ['js', 'js'],
    ['intro.json', 'intro.json'],
    ['images/ai-playground', 'images/ai-playground'],
    ['videos/freetime', 'videos/freetime'],
  ];

  return {
    name: 'copy-runtime-assets',
    closeBundle() {
      const root = process.cwd();
      const out = resolve(root, 'dist');
      for (const [from, to] of copies) {
        const src = resolve(root, from);
        const dest = resolve(out, to);
        if (!existsSync(src)) continue;
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(src, dest, {
          recursive: true,
          filter: (path) => !path.endsWith('.mov'),
        });
      }
    },
  };
}

export default defineConfig(({ command }) => ({
  // Relative base so GitHub Pages (project or user site) resolves assets correctly.
  base: command === 'build' ? './' : '/',
  plugins: [react(), copyRuntimeAssets()],
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
