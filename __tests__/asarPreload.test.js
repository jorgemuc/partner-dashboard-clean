const { execSync } = require('node:child_process');

// ensure packaging places the preload script in app.asar

test('asar contains preload', () => {
  if (process.platform !== 'win32') return;
  execSync('npm run bundle', { stdio: 'inherit' });
  execSync('electron-builder --win dir', { stdio: 'inherit' });

  const cmd = 'node scripts/verify-preload-in-asar.js dist/win-unpacked/resources/app.asar';
  expect(() => execSync(cmd)).not.toThrow();
});




