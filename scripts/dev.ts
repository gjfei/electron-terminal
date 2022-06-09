import { spawn } from 'child_process';
import path from 'path';
import { createServer, build } from 'vite';
import electron from 'electron';
import electronRebuild from 'electron-rebuild';
import type { ChildProcessWithoutNullStreams } from 'child_process';

// const lifecycles = [];
// for (const dir of ['native-core', 'electron-core']) {
//   const build = electronRebuild({
//     buildPath: path.resolve(__dirname, `../packages/${dir}`),
//     electronVersion: '18.0.4',
//     arch: process.arch,
//     force: true,
//   });
//   build.catch((e) => {
//     process.exit(1);
//   });
//   lifecycles.push([build.lifecycle, dir]);
// }

// for (const [lc, dir] of lifecycles) {
//   lc.on('module-found', (name) => {
//     console.info('Rebuilding', `${dir}/${name}`);
//   });
// }

const startWebCore = async () => {
  const server = await createServer({
    configFile: 'packages/web-core/vite.config.ts',
    mode: 'development',
  });

  await server.listen();
  return server;
};

const startNativeCore = async () => {
  const server = await build({
    configFile: 'packages/native-core/vite.config.ts',
    mode: 'development',
    build: {
      watch: {},
    },
  });
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
    build: {
      watch: {},
    },
  });
  return server;
};

const start = async () => {
  await startWebCore();
  await startNativeCore();
  await startElectronPreload();
  await startElectronCore();
};

start();
