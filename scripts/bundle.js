#!/usr/bin/env node
const esbuild = require('esbuild');
const importGlob = require('esbuild-plugin-import-glob').default;
const { version } = require('../package.json');
const { mkdirSync, writeFileSync, copyFileSync } = require('node:fs');

async function bundle() {
  mkdirSync('dist', { recursive: true });

  await esbuild.build({
    entryPoints: ['src/preload.cjs'],
    bundle: true,
    minify: true,
    platform: 'node',
    external: ['mitt','fs','path','os','crypto','util'],
    target: ['node16'],
    outfile: 'dist/preload.js',
    logLevel: 'info'
  });

  await esbuild.build({
      entryPoints: ['src/renderer/renderer.js'],
      bundle: true,
      minify: true,
      treeShaking: true,
      outfile: 'dist/renderer.bundle.js',
      format: 'esm',
      target: ['es2022'],
      define: { 'process.env.NODE_ENV': '"production"' },
      external: ['electron'],
      plugins: [importGlob()],
      sourcemap: true,
      logLevel: 'info'
  });

  writeFileSync('dist/version.json', JSON.stringify({ version }, null, 2) + '\n');
  console.log('[bundle] wrote dist files');
}

bundle().catch((err) => {
  console.error(err);
  process.exit(1);
});
