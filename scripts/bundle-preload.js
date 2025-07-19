#!/usr/bin/env node
const esbuild = require('esbuild');
const fs = require('fs');
const { version } = require('../package.json');

fs.mkdirSync('dist', { recursive: true });

esbuild.build({
  entryPoints: ['src/preload/index.js'],
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: ['chrome115'],
  external: ['electron'],
  define: { APP_VERSION: JSON.stringify(version) },
  outfile: 'dist/preload.js',
  minify: false,
  logLevel: 'info'
}).catch(() => process.exit(1));
