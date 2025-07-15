const path = require('node:path');
const fs = require('node:fs/promises');
const asar = require('@electron/asar');

module.exports = async (ctx) => {
  const asarPath = path.join(ctx.appOutDir, 'resources', 'app.asar');
  try {
    await fs.access(asarPath);
  } catch {
    throw new Error('app.asar missing');
  }
  const entries = asar.listPackage(asarPath).map(e => e.replace(/\\/g, '/'));
  if (!entries.includes('dist/preload.js')) {
    throw new Error('preload.js missing');
  }
};
