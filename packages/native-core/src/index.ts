import { spawn } from 'node-pty';
import { HK, getRegistryValue } from './registry';
import type { IPtyForkOptions, IWindowsPtyForkOptions, IPty } from 'node-pty';

export type { IPty };

export const getPowerShellCore = () => {
  return getRegistryValue(
    HK.LM,
    'SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\pwsh.exe',
    ''
  );
};

export const createPowerShellCore = (
  args: string[] | string,
  options: IPtyForkOptions | IWindowsPtyForkOptions
) => {
  const command = getPowerShellCore();
  if (command) {
    return spawn(command, args, options);
  }
  return null;
};
