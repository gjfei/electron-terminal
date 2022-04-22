import { spawn } from 'child_process';
import { createServer, build } from 'vite';
import electron from 'electron';
import type { ChildProcessWithoutNullStreams } from 'child_process';

const startWebCore = async () => {
  const server = await createServer({
    configFile: 'packages/web-core/vite.config.ts',
    mode: 'development',
  });

  await server.listen();
  return server;
};

const startElectronCore = async () => {
  let electronProcess: ChildProcessWithoutNullStreams | null = null;

  const server = await build({
    configFile: 'packages/electron-core/vite.config.ts',
    mode: 'development',
    build: {
      watch: {},
    },
    plugins: [
      {
        name: 'electron-core-watcher',
        writeBundle() {
          electronProcess && electronProcess.kill();
          electronProcess = spawn(electron, ['.'], { stdio: 'inherit' });
        },
      },
    ],
  });

  return server;
};

const startElectronPreload = async () => {
  const server = build({
    configFile: 'packages/electron-preload/vite.config.ts',
    mode: 'development',
    plugins: [
      {
        name: 'electron-preload-watcher',
        writeBundle() {},
      },
    ],
    build: {
      watch: {},
    },
  });
  return server;
};

const start = async () => {
  await startWebCore();
  await startElectronPreload();
  await startElectronCore();
};

start();
