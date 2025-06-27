const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, rmSync } = require('node:fs');
const { version } = require('../package.json');

test('bundle writes version file and renderer bundle', () => {
  rmSync('dist', { recursive: true, force: true });
  execFileSync('node', ['scripts/bundle.js']);
  expect(existsSync('dist/version.json')).toBe(true);
  expect(existsSync('dist/preload.js')).toBe(true);
  expect(existsSync('dist/renderer.bundle.js')).toBe(true);
  expect(existsSync('dist/renderer.bundle.js.map')).toBe(true);
  const data = JSON.parse(readFileSync('dist/version.json', 'utf8'));
  expect(data.version).toBe(version);
});
