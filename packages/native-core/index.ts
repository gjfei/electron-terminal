export enum REG {
  SZ = 1,
  EXPAND_SZ = 2,
  BINARY = 3,
  DWORD = 4,
  DWORD_BIG_ENDIAN = 5,
  DWORD_LITTLE_ENDIAN = 4,
  LINK = 6,
  MULTI_SZ = 7,
  RESOURCE_LIST = 8,
}

export enum HK {
  CR = 0x80000000,
  CU = 0x80000001,
  LM = 0x80000002,
  U = 0x80000003,
  PD = 0x80000004,
  CC = 0x80000005,
  DD = 0x80000006,
}
export interface RegistryValue {
  name: string;
  type: REG;
  value: any;
}

type Native = {
  getKey: (root: HK, path: string) => RegistryValue[];
};

let native: Native;
function getNative() {
  if (!native) {
    native = require('./build/Release/native.node');
  }
  return native;
}

export const getRegistryKey = (root: HK, path: string) => {
  const key = getNative().getKey(root, path);
  if (!key) {
    return null;
  }
  const ret: Record<string, RegistryValue> = {};
  for (const value of key) {
    ret[value.name] = value;
  }
  return ret;
};

export const getRegistryValue = (root: HK, path: string, name: string) => {
  const key = getRegistryKey(root, path);
  if (!key || !key[name]) {
    return null;
  }
  return key[name].value;
};
