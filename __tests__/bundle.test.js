const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, rmSync } = require('node:fs');
const { version } = require('../package.json');

test('bundle writes version file and renderer bundle', () => {
  rmSync('build/unpacked', { recursive: true, force: true });
  execFileSync('node', ['scripts/bundle.js']);
  expect(existsSync('build/unpacked/version.json')).toBe(true);
  expect(existsSync('build/unpacked/preload.js')).toBe(true);
  expect(existsSync('build/unpacked/renderer.bundle.js')).toBe(true);
  expect(existsSync('build/unpacked/renderer.bundle.js.map')).toBe(true);
  const data = JSON.parse(readFileSync('build/unpacked/version.json', 'utf8'));
  expect(data.version).toBe(version);
});
