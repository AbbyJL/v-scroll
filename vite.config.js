import { defineConfig } from 'vite';
import createCssPlugin from './plugins/css-plugin.js';

export default defineConfig({
  base: '/v-scroll/',
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