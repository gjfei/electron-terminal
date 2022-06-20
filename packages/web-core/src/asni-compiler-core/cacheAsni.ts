const cacheViewport = [];

export const clearCacheVieport = () => {
  cacheViewport.length = 0;
};

const cacheStyles = new Map<string, string>();

export const addCacheStyle = ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  cacheStyles.set(key, value);
};

export const deleteCacheStyle = (key?: string) => {
  if (key) {
    cacheStyles.delete(key);
  } else {
    cacheStyles.clear();
  }
};

export const getCacheStyes = () => {
  const styles: string[] = [];
  cacheStyles.forEach((value, key) => {
    styles.push(`${key}:${value}`);
  });
  return styles;
};
