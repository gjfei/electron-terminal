import { builtinModules } from 'module';
import { defineConfig } from 'vite';

export default () => {
  return defineConfig({
    root: __dirname,
    build: {
      sourcemap: true,
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
  });
};
