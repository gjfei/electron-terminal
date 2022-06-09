import { join } from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { createPowerShellCore } from '@electron-terminal/native-core';
import type { IPty } from '@electron-terminal/native-core';

let win: BrowserWindow;

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    webPreferences: {
      preload: join(__dirname, '../electron-preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // 是否打包， 区分开发和生产
  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../web-core/index.html'));
  } else {
    const url = `http://127.0.0.1:3000`;
    win.loadURL(url);
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

let terminalProcess: IPty | null;

ipcMain.on('init-terminal', () => {
  if (terminalProcess) {
    return;
  }

  terminalProcess = createPowerShellCore([], {
    env: process.env as Record<string, string>,
    cols: 80,
    rows: 24,
  });

  if (terminalProcess) {
    terminalProcess.onData((event) => {
      win.webContents.send('terminal-output', event);
    });
  }
});

ipcMain.on('terminal-write', (event, command) => {
  terminalProcess?.write(command);
});
