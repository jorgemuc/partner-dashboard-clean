#!/usr/bin/env node
// renderer bundle + version file
const esbuild = require('esbuild');
const { version } = require('../package.json');
const { mkdirSync, writeFileSync } = require('node:fs');

esbuild.build({
  entryPoints: ['src/renderer/renderer.js'],
  bundle: true,
  outfile: 'dist/renderer.bundle.js',
  format: 'esm',
  target: ['es2022'],
  external: ['electron'],
  sourcemap: process.env.NODE_ENV !== 'production',
  logLevel: 'info'
}).catch(() => process.exit(1));

// --- single-source version record -----------------------------------
mkdirSync('dist', { recursive: true });
writeFileSync('dist/version.json', JSON.stringify({ version }, null, 2) + '\n');
console.log('[bundle] wrote dist/version.json');
