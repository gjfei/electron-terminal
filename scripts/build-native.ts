#!/usr/bin/env node
import path from 'path';
import { readFileSync } from 'fs';
import _rebuild from 'electron-rebuild';

const electronPkg = JSON.parse(
  readFileSync(
    path.resolve(__dirname, '../node_modules/electron/package.json'),
    'utf8'
  )
);

const nativeDir = ['../packages/native-core', '../node_modules/node-pty'];

const rebuild = (dir) => {
  return new Promise((resolve, reject) => {
    const build = _rebuild({
      buildPath: path.resolve(__dirname, dir),
      electronVersion: electronPkg.version,
      force: true,
    });
    build.then(resolve);
    build.catch((error) => {
      reject(error);
      process.exit(1);
    });
    build.lifecycle;
    build.lifecycle.on('module-found', (name) => {
      console.info('Rebuilding', `${dir}/${name}`);
    });
  });
};

const start = async () => {
  for (const dir of nativeDir) {
    await rebuild(dir);
  }
};

start();
