const test = require('node:test');
const assert = require('node:assert/strict');
const { getMenuTemplate } = require('../main');

test('menu contains Toggle Developer Tools', () => {
  const tmpl = getMenuTemplate({});
  const view = tmpl.find(item => item.label === 'View');
  assert.ok(view, 'View menu exists');
  const dev = view.submenu.find(i => i.label === 'Toggle Developer Tools');
  assert.ok(dev, 'DevTools menu item exists');
});
