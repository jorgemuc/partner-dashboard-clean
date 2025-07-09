const { execSync } = require('node:child_process');

// Build and verify preload inclusion in app.asar

test('asar contains preload', () => {
  if (process.platform !== 'win32') return;
  execSync('npm run bundle', { stdio: 'inherit' });
  execSync('electron-builder --win dir', { stdio: 'inherit' });
  expect(() => {
    execSync('node scripts/verify-preload-in-asar.js dist/win-unpacked/resources/app.asar');
  }).not.toThrow();
});
