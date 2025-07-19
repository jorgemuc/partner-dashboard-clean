#!/usr/bin/env node
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');
const importGlob = require('esbuild-plugin-import-glob').default;

const DEBUG = /^(debug|trace)$/.test(process.env.LOG_LEVEL || '');

function log(...a){ if (DEBUG) console.log('[bundle]', ...a); }
function warn(...a){ console.warn('[bundle:warn]', ...a); }
function err(...a){ console.error('[bundle:error]', ...a); }

process.on('unhandledRejection', r => {
  console.error('[bundle:unhandledRejection]', r);
  process.exitCode = 1;
});
process.on('uncaughtException', e => {
  console.error('[bundle:uncaughtException]', e);
  process.exitCode = 1;
});

console.time('[bundle:total]');
(async () => {
  log('start');

  let version = '0.0.0';
  try {
    const pkg = require('../package.json');
    if (pkg && pkg.version) version = pkg.version;
    log('package version', version);
  } catch(e) {
    warn('could not read package.json version – using fallback', e.message);
  }

  fs.mkdirSync('build/unpacked', { recursive: true });
  log('invoking esbuild.render');
  const buildResult = await esbuild.build({
    entryPoints: ['src/renderer/renderer.js'],
    bundle: true,
    minify: true,
    treeShaking: true,
    outfile: 'build/unpacked/renderer.bundle.js',
    format: 'esm',
    target: ['es2022'],
    define: {
      'process.env.APP_VERSION': JSON.stringify(version),
      APP_VERSION: JSON.stringify(version),
      ...(process.env.NODE_ENV === 'production' ? { 'process.env.NODE_ENV': '"production"' } : {})
    },
    external: ['electron'],
    plugins: [importGlob()],
    sourcemap: true,
    logLevel: 'silent'
  });

  if (buildResult.warnings?.length) {
    warn(`esbuild warnings: ${buildResult.warnings.length}`);
    if (DEBUG) buildResult.warnings.forEach(w => warn(w));
  }
  log('renderer build ok');

  if (!fs.existsSync(path.join(__dirname, 'bundle-preload.js'))) {
    log('building preload inline');
    const preloadEntry = fs.existsSync('src/preload/index.cjs')
      ? 'src/preload/index.cjs'
      : (fs.existsSync('src/preload/index.js') ? 'src/preload/index.js' : null);
    if (!preloadEntry) {
      warn('no preload entry found, skipping preload build');
    } else {
      const preloadResult = await esbuild.build({
        entryPoints: [preloadEntry],
        bundle: true,
        platform: 'browser',
        format: 'iife',
        target: 'es2020',
        outfile: 'dist/preload.js',
        banner: { js: '// generated preload bundle' },
        define: {
          'process.env.APP_VERSION': JSON.stringify(version),
          APP_VERSION: JSON.stringify(version)
        },
        minify: true,
        logLevel: 'silent'
      });
      if (preloadResult.warnings?.length) warn(`preload warnings: ${preloadResult.warnings.length}`);
      log('preload build ok');
    }
  } else {
    log('skipping inline preload – external script present');
  }

  try {
    fs.mkdirSync('dist', { recursive: true });
    fs.writeFileSync('dist/version.json', JSON.stringify({ version }, null, 2));
    fs.mkdirSync('build/unpacked', { recursive: true });
    fs.writeFileSync('build/unpacked/version.json', JSON.stringify({ version }, null, 2));
    if (!fs.existsSync('main.js')) fs.copyFileSync('src/main.js', 'main.js');
    log('wrote dist/version.json');
  } catch(e) {
    warn('failed to write dist/version.json', e.message);
  }

  console.log('  build/unpacked/renderer.bundle.js      (done)');
  log('before success marker');
  console.timeEnd('[bundle:total]');
  if (process.exitCode && process.exitCode !== 0) {
    err('Process had recorded exitCode != 0 earlier – preserving.');
    process.exit(process.exitCode);
  }
  process.exit(0);
})();
