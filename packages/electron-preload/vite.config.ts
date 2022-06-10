import { builtinModules } from 'module';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  return {
    root: __dirname,
    build: {
      sourcemap: isDev,
      outDir: '../../dist/electron-preload',
      emptyOutDir: true,
      lib: {
        entry: 'index.ts',
        formats: ['cjs'],
        fileName: () => `[name].js`,
      },
      rollupOptions: {
        //  排除electorn 和 node
        external: ['electron', ...builtinModules],
      },
    },
  };
});
