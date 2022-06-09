import { builtinModules } from 'module';
import { defineConfig } from 'vite';

export default () => {
  return defineConfig({
    root: __dirname,
    build: {
      sourcemap: true,
      outDir: './dist',
      emptyOutDir: true,
      lib: {
        entry: 'src/index.ts',
        formats: ['cjs'],
        fileName: () => `[name].js`,
      },
      rollupOptions: {
        //  排除electorn 和 node
        external: ['electron', 'node-pty', ...builtinModules],
      },
    },
  });
};
