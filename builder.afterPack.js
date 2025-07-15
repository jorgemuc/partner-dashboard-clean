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
  const entries = asar.listPackage(asarPath);
  const hasPreload = entries.some(p => {
    const normalised = p.replace(/\\/g, '/');
    return normalised.endsWith('/preload.js') || normalised === 'preload.js';
  });
  if (!hasPreload) {
    throw new Error('preload.js missing');
  }
};
