const { execFileSync } = require('node:child_process');
const { existsSync, rmSync } = require('node:fs');

test('preload bundle exists', () => {
  rmSync('dist', { recursive: true, force: true });
  execFileSync('node', ['scripts/bundle.js']);
  expect(existsSync('dist/preload.js')).toBe(true);
});

