const fs = require('fs');
const os = require('os');
const path = require('path');
const resolvePreloadPath = require('../src/main/resolvePreloadPath');

test('prefers dist/preload.js when present', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pl-'));
  fs.mkdirSync(path.join(dir, 'dist'));
  const distPath = path.join(dir, 'dist', 'preload.js');
  const fallback = path.join(dir, 'preload.js');
  fs.writeFileSync(distPath, '');
  fs.writeFileSync(fallback, '');
  expect(resolvePreloadPath(dir)).toBe(distPath);
});

test('falls back to preload.js when dist missing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pl-'));
  const fallback = path.join(dir, 'preload.js');
  fs.writeFileSync(fallback, '');
  expect(resolvePreloadPath(dir)).toBe(fallback);
});
