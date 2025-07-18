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

  test('logs preload missing when file absent', () => {
    process.env.LOG_LEVEL = 'debug';
    try { fs.unlinkSync(logPath); } catch {}
    const exists = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.isolateModules(() => {
      jest.doMock('electron-log', () => ({
        info: jest.fn(),
        transports: { file: { level: 'debug', resolvePathFn: jest.fn() }, console: { level: 'debug' } }
      }));
      const log = require('electron-log');
      require('../main.js');
      expect(log.info).toHaveBeenCalledWith('[pl-dbg] preload missing', expect.any(String));
    });
    exists.mockRestore();
  });

  test('default log level is info', () => {
    delete process.env.LOG_LEVEL;
    jest.isolateModules(() => {
      jest.doMock('electron-log', () => ({
        info: jest.fn(),
        error: jest.fn(),
        transports: { file: { level: 'warn', resolvePathFn: jest.fn() }, console: { level: 'warn' } }
      }));
      const log = require('electron-log');
      require('../main.js');
      expect(log.transports.file.level).toBe('info');
    });
  });

  test('forwards renderer console when DEBUG set', () => {
    process.env.DEBUG = '1';
    jest.isolateModules(() => {
      jest.doMock('electron-log', () => ({
        info: jest.fn(),
        error: jest.fn(),
        transports: { file: { level: 'info', resolvePathFn: jest.fn() }, console: { level: 'info' } }
      }));
      const log = require('electron-log');
      const { createWindow } = require('../main.js');
      createWindow();
      const win = require('electron').__lastWindow();
      win.webContents.emit('console-message', {}, 1, 'msg');
      expect(log.info).toHaveBeenCalledWith('[renderer]', 'msg');
    });
    delete process.env.DEBUG;
  });

  test('logs renderer crashes with prefix', () => {
    process.env.LOG_LEVEL = 'debug';
    jest.isolateModules(() => {
      jest.doMock('electron-log', () => ({
        info: jest.fn(),
        error: jest.fn(),
        transports: { file: { level: 'debug', resolvePathFn: jest.fn() }, console: { level: 'debug' } }
      }));
      const log = require('electron-log');
      const { createWindow } = require('../main.js');
      createWindow();
      const win = require('electron').__lastWindow();
      win.webContents.emit('render-process-gone', {}, { reason: 'crashed' });
      expect(log.error).toHaveBeenCalledWith('[pl-err] renderer crashed', 'crashed');
    });
  });
});
