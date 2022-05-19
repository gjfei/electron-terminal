import type electron from 'electron';
declare global {
  interface Window {
    electron: electron;
    removeLoading: () => void;
  }
}

export {};
