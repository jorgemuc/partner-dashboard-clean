#!/usr/bin/env node
const esbuild = require('esbuild');
const importGlob = require('esbuild-plugin-import-glob').default;
const { version } = require('../package.json');
const { mkdirSync, writeFileSync, copyFileSync } = require('node:fs');

mkdirSync('dist', { recursive: true });
copyFileSync('src/preload.cjs', 'dist/preload.js');

esbuild.build({
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
}).catch(() => process.exit(1));

writeFileSync('dist/version.json', JSON.stringify({ version }, null, 2) + '\n');
console.log('[bundle] wrote dist files');
