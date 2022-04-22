import { join } from 'path';
import { app, BrowserWindow } from 'electron';
let win: BrowserWindow | null = null;

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
