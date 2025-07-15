import { defineConfig } from 'vite';
import { wsx } from '@systembug/wsx-vite-plugin';

export default defineConfig({
  plugins: [
    wsx({
      debug: false,
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    }),
  ],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@systembug/wsx-core': new URL('../core/src/index.ts', import.meta.url).pathname,
    },
  },
});
