#!/usr/bin/env node
const esbuild = require('esbuild');

require('fs').mkdirSync('dist', { recursive: true });

esbuild.build({
  entryPoints: ['src/preload.js'],
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  external: ['electron'],
  outfile: 'dist/preload.js',
  logLevel: 'silent'
}).catch(() => process.exit(1));
