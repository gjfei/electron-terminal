import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteExternalsPlugin } from 'vite-plugin-externals';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  return {
    base: './',
    root: __dirname,
    build: {
      sourcemap: isDev,
    },
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      vue(),
      viteExternalsPlugin({
        electron: 'electron',
      }),
    ],
    optimizeDeps: {
      exclude: ['electron'],
    },
  };
});
