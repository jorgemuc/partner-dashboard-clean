const { spawnSync } = require('child_process');

test('lint-no-bare-imports exits with code 0', () => {
  const res = spawnSync('node', ['scripts/lint-no-bare-imports.js'], { encoding: 'utf8' });
  expect(res.status).toBe(0);
});
