import path from 'path';
import { readFileSync } from 'fs';
import { build as electronBuild } from 'electron-builder';
import { build as viteBuild } from 'vite';

const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
);

const build = async () => {
  try {
    for (const packageName of [
      'web-core',
      'native-core',
      'electron-core',
      'electron-preload',
    ]) {
      console.log('=====================================================');
      console.log(`Building package ${packageName}`);
      await viteBuild({
        configFile: `packages/${packageName}/vite.config.ts`,
      });
      console.log(`Package ${packageName} built`);
      console.log('=====================================================');
    }

    await electronBuild({
      dir: false,
      win: ['zip'],
      arm64: process.arch === 'arm64',
      config: {
        extraMetadata: {
          version: pkg.version,
        },
      },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

build();
