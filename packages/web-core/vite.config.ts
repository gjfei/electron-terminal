import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default ({ command }) => {
  const isDev = command === 'serve';

  return defineConfig({
    root: __dirname,
    build: {
      sourcemap: isDev,
    },
    plugins: [vue()],
  });
};
