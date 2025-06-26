/**
 * Small helper to replace @@VERSION@@ tokens in docs before release.
 * Usage: node scripts/version-inject.js README.md CHANGELOG.md
 */
const fs = require('fs');
const pkgVer = require('../package.json').version;
process.argv.slice(2).forEach(f => {
  const txt = fs.readFileSync(f, 'utf8').replace(/@@VERSION@@/g, pkgVer);
  fs.writeFileSync(f, txt);
});
