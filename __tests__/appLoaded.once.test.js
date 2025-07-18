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
    __mockedSend: send,
    __lastWindow: () => lastWindow
  };
});

const { ipcMain, __mockedSend: send, __lastWindow } = require('electron');

describe('app-loaded IPC', () => {
  test('emitted once after did-finish-load', async () => {
    const { createWindow } = require('../main.js');
    createWindow();
    const win = __lastWindow();
    let count = 0;
    ipcMain.on('app-loaded', () => { count += 1; });
    win.webContents.emit('did-finish-load');
    expect(send).toHaveBeenCalledWith('app-loaded');
    expect(count).toBe(1);
  });
});
