const { test } = require('@jest/globals');
const pkg = require('../package.json');

test('windows build config disables signing', () => {
  expect(pkg.build.win.sign).toBe(false);
  expect(pkg.build.win).not.toHaveProperty('certificateSha1');
});
