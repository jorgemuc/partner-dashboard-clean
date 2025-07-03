const { test } = require('@jest/globals');
const assert = require('node:assert/strict');

jest.mock('electron', () => ({
  app: { getVersion: () => '0.0.0', getAppPath: () => '.' },
  BrowserWindow: function() {},
  Menu: { buildFromTemplate: t => t },
  shell: {}, dialog: {},
  ipcMain: { handle: jest.fn() }
}));

const { getMenuTemplate } = require('../main');

test('menu contains Toggle Developer Tools', () => {
  const tmpl = getMenuTemplate({});
  const view = tmpl.find(item => item.label === 'View');
  assert.ok(view, 'View menu exists');
  const dev = view.submenu.find(i => i.label === 'Toggle Developer Tools');
  assert.ok(dev, 'DevTools menu item exists');
});
