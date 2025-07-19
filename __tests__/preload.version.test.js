const fs = require('fs');
const vm = require('vm');
const { JSDOM } = require('jsdom');

test('version api returns semver', () => {
  const code = fs.readFileSync(require.resolve('../dist/preload.js'), 'utf8');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only' });
  const ctx = dom.getInternalVMContext();
  ctx.require = require;
  vm.runInContext(code, ctx);
  const { window } = dom;
  expect(typeof window.api.version).toBe('function');
  expect(window.api.version()).toMatch(/^\d+\.\d+\.\d+$/);
});
