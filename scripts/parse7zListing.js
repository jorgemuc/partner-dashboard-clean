#!/usr/bin/env node

function findAppAsarPath(listing) {
  const match = listing.match(/(\S*resources[\\\/]+app\.asar)/i);
  return match ? match[1] : null;
}

if (require.main === module) {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { data += chunk; });
  process.stdin.on('end', () => {
    const path = findAppAsarPath(data);
    if (path) process.stdout.write(path + '\n');
  });
} else {
  module.exports = { findAppAsarPath };
}
