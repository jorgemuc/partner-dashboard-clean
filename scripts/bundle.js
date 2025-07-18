#!/usr/bin/env node
const esbuild = require('esbuild');
const importGlob = require('esbuild-plugin-import-glob').default;
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

fs.mkdirSync('build/unpacked', { recursive: true });

esbuild.build({
  entryPoints: ['src/renderer/renderer.js'],
  bundle: true,
  minify: true,
  treeShaking: true,
  outfile: 'build/unpacked/renderer.bundle.js',
  format: 'esm',
  target: ['es2022'],
  define: { 'process.env.NODE_ENV': '"production"' },
  external: ['electron'],
  plugins: [importGlob()],
  sourcemap: true,
  logLevel: 'info'
}).then(() => {
  fs.writeFileSync('build/unpacked/version.json', JSON.stringify({ version }, null, 2) + '\n');
  fs.writeFileSync('dist/version.json', JSON.stringify({ version }, null, 2) + '\n');
  if (!fs.existsSync('main.js')) fs.copyFileSync('src/main.js', 'main.js');
  console.log('[bundle] wrote build files');
}).catch(() => process.exit(1));
