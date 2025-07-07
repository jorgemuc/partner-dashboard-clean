#!/usr/bin/env node
const esbuild = require('esbuild');
const importGlob = require('esbuild-plugin-import-glob').default;
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

fs.mkdirSync('dist', { recursive: true });

esbuild.build({
    entryPoints: ['src/preload.cjs'],
    bundle: true,
    minify: true,
    platform: 'node',
    external: ['electron', 'fs', 'path', 'os', 'crypto', 'util'],
    target: ['node16'],
    outfile: 'dist/preload.js',
    logLevel: 'info'
  })
  .then(() => esbuild.build({
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
    }))
  .then(() => {
    fs.writeFileSync(
      'dist/version.json',
      JSON.stringify({ version }, null, 2) + '\n'
    );
    if (!fs.existsSync('main.js')) fs.copyFileSync('src/main.js', 'main.js');
    console.log('[bundle] wrote dist files');
  })
  .catch(() => process.exit(1));
