const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const icoPath = path.join(__dirname, '..', 'assets', 'icon.ico');
try {
  if (fs.statSync(icoPath).size >= 1024) process.exit(0);
} catch (e) {}

const pngPath = path.join(__dirname, '..', 'assets', 'icons', 'icon.png');
(async () => {
  try {
    const buf = await pngToIco(pngPath);
    fs.writeFileSync(icoPath, buf);
    console.log('generated icon');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
