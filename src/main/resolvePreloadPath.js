const fs = require('fs');
const path = require('path');

function resolvePreloadPath(baseDir) {
  const dist = path.join(baseDir, 'dist', 'preload.js');
  if (fs.existsSync(dist)) return dist;
  return path.join(baseDir, 'preload.js');
}

module.exports = resolvePreloadPath;
