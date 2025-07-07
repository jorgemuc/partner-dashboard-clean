const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const src = path.join(__dirname, '..', 'assets', 'icon.png');
    const dest = path.join(__dirname, '..', 'dist', 'icon.ico');
    if (!fs.existsSync(src)) {
      console.error('icon.png missing');
      process.exit(1);
    }
    await sharp(src).resize(256, 256).toFile(dest);
    console.log('generated dist/icon.ico');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
