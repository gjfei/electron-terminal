import { join } from 'path';
import { exec } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import type { ChildProcess } from 'child_process';
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

let terminalProcess: ChildProcess;

ipcMain.on('init-terminal', () => {
  if (terminalProcess) {
    return;
  }
  terminalProcess = exec('"C:\\Program Files\\PowerShell\\7\\pwsh.exe"');
  terminalProcess.stdout.on('data', (data) => {
    win.webContents.send('terminal-output', data);
  });
  terminalProcess.stderr.on('data', (data) => {
    // console.error(`stderr: ${data}`);
  });
  terminalProcess.on('close', (code) => {
    // console.log(`child process exited with code ${code}`);
  });
  terminalProcess.stdin.write('ls');
  terminalProcess.stdin.write('\n');
});

ipcMain.on('terminal-write', (event, command) => {
  terminalProcess.stdin.write(command);
});
