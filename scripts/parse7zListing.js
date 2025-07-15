function findAppAsarPath(listing) {
  const match = listing.match(/(\S*resources[\\\/]+app\.asar)/i);
  return match ? match[1] : null;
}
module.exports = { findAppAsarPath };
