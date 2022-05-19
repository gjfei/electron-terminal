let native;
function getNative() {
  if (!native) {
    native = require('./build/Release/native.node');
  }
  return native;
}

export const getRegistryKey = (root: string, path: string) => {
  const ret = {};
  const key = getNative().getKey(root, path);
  if (!key) {
    return null;
  }
  for (const value of key) {
    ret[value.name] = value;
  }
  return ret;
};

export const getRegistryValue = (root: string, path: string, name: string) => {
  const key = getRegistryKey(root, path);
  if (!key || !key[name]) {
    return null;
  }
  return key[name].value;
};
