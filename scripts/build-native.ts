#!/usr/bin/env node
import path from 'path';
import rebuild from 'electron-rebuild';

process.env.ARCH =
  (process.env.ARCH || process.arch) === 'arm' ? 'armv7l' : process.arch;

const lifecycles = [];
for (const dir of ['../node_modules/node-pty']) {
  const build = rebuild({
    buildPath: path.resolve(__dirname, dir),
    electronVersion: '19.0.4',
    arch: process.env.ARCH,
    force: true,
    debug: true,
  });
  build.catch((e) => {
    console.error(e);
    process.exit(1);
  });
  lifecycles.push([build.lifecycle, dir]);
}

console.info('Building against Electron', '19.0.4');

for (const [lc, dir] of lifecycles) {
  lc.on('module-found', (name) => {
    console.info('Rebuilding', `${dir}/${name}`);
  });
}
