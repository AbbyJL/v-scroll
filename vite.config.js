import { defineConfig } from 'vite';
import createCssPlugin from './plugins/css-plugin.js';

export default defineConfig({
  plugins: [createCssPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});