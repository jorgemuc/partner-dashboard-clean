#!/usr/bin/env node
const esbuild = require('esbuild');
const importGlob = require('esbuild-plugin-import-glob').default;
const fs = require('node:fs');
const path = require('node:path');
const { version } = require('../package.json');
const { mkdirSync, writeFileSync, copyFileSync, existsSync } = require('node:fs');

async function bundle() {
  mkdirSync('dist', { recursive: true });

  await esbuild.build({
    entryPoints: ['src/preload.cjs'],
    bundle: true,
    minify: true,
    platform: 'node',
    external: ['electron', 'fs', 'path', 'os', 'crypto', 'util'],
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
      plugins: [importGlob(), {
        name: 'raw-loader',
        setup(build){
          build.onResolve({filter:/\?raw$/}, args => ({
            path: path.resolve(args.resolveDir, args.path.replace(/\?raw$/, '')),
            namespace: 'raw'
          }));
          build.onLoad({filter:/.*/, namespace:'raw'}, async args => ({
            contents: await fs.promises.readFile(args.path, 'utf8'),
            loader: 'text'
          }));
        }
      }],
      sourcemap: true,
      logLevel: 'info'
    });

  writeFileSync('dist/version.json', JSON.stringify({ version }, null, 2) + '\n');
  if (!existsSync('main.js')) copyFileSync('src/main.js', 'main.js');
  console.log('[bundle] wrote dist files');
}

bundle().catch((err) => {
  console.error(err);
  process.exit(1);
});
