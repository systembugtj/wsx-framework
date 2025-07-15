import { defineConfig } from 'vite';
import { wsx } from '@systembug/wsx-vite-plugin';

export default defineConfig({
  plugins: [wsx()],
  build: {
    outDir: 'dist',
  },
});
