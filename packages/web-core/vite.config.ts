import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  return {
    root: __dirname,
    build: {
      sourcemap: isDev,
    },
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [vue()],
  };
});
