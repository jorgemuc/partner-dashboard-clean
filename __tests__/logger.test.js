const fs = require('fs');
const path = require('path');

jest.mock('electron', () => {
  const { EventEmitter } = require('events');
  const send = jest.fn();
  let lastWindow;
  class WebContents extends EventEmitter {
    send = send;
  }
  class BrowserWindow {
    constructor() {
      this.webContents = new WebContents();
      lastWindow = this;
    }
    loadFile() {
      setImmediate(() => this.webContents.emit('did-finish-load'));
    }
    setMenu() {}
  }
  const ipcMain = new EventEmitter();
  ipcMain.handle = jest.fn();
  return {
    app: { getVersion: () => '0.0.0', whenReady: () => Promise.resolve(), on: jest.fn() },
    BrowserWindow,
    Menu: { setApplicationMenu: jest.fn(), buildFromTemplate: t => t },
    shell: {}, dialog: {}, ipcMain,
    __lastWindow: () => lastWindow
  };
});

const logPath = path.join(__dirname, '../logs/main.log');

describe('debug logger', () => {
  test('writes app-loaded event', async () => {
    process.env.LOG_LEVEL = 'debug';
    try { fs.unlinkSync(logPath); } catch {}
    const { createWindow } = require('../main.js');
    createWindow();
    const win = require('electron').__lastWindow();
    win.webContents.emit('did-finish-load');
    const txt = fs.readFileSync(logPath, 'utf8');
    expect(txt.includes('emitting app-loaded')).toBe(true);
  });
});
