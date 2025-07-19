const { spawnSync } = require('child_process');
const fs = require('fs');

const script = 'scripts/verify-bundle.js';

function setupSuccessEnv() {
  fs.rmSync('build', { recursive: true, force: true });
  fs.rmSync('dist', { recursive: true, force: true });
  fs.mkdirSync('build/unpacked', { recursive: true });
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('build/unpacked/renderer.bundle.js', 'x'.repeat(60 * 1024));
  fs.writeFileSync('dist/preload.js', 'x'.repeat(2048));
  fs.writeFileSync('dist/version.json', JSON.stringify({ version: '1.2.3' }));
  fs.writeFileSync('log.txt', '[bundle:success] renderer.bundle.js written');
}

test('verify-bundle fails when artifacts missing', () => {
  fs.rmSync('build', { recursive: true, force: true });
  fs.rmSync('dist', { recursive: true, force: true });
  const res = spawnSync('node', [script], { encoding: 'utf8' });
  expect(res.status).toBe(1);
  const out = JSON.parse(res.stdout.trim());
  expect(out.reason).toBe('missing-artifact');
});

test('verify-bundle succeeds with valid artifacts and marker', () => {
  setupSuccessEnv();
  const res = spawnSync('node', [script], {
    env: { ...process.env, BUNDLE_LOG_PATH: 'log.txt' },
    encoding: 'utf8'
  });
  expect(res.status).toBe(0);
  expect(res.stdout).toContain('[verify] ok');
});

test('verify-bundle fails when success marker missing', () => {
  setupSuccessEnv();
  fs.writeFileSync('log.txt', 'no marker');
  const res = spawnSync('node', [script], {
    env: { ...process.env, BUNDLE_LOG_PATH: 'log.txt' },
    encoding: 'utf8'
  });
  expect(res.status).toBe(1);
  const out = JSON.parse(res.stdout.trim());
  expect(out.reason).toBe('missing-success-marker');
});
