const path  = require('path');
const fs    = require('fs');               // ← erst import …
const sharp = require('sharp');

// ----- sorgt dafür, dass der Ordner immer existiert -----
fs.mkdirSync(path.resolve(__dirname, '..', 'dist'), { recursive: true });
// --------------------------------------------------------

(async () => {
  try {
    const src = path.join(__dirname, '..', 'assets', 'icon.png');
    const dest = path.join(__dirname, '..', 'dist', 'icon.ico');
    if (!fs.existsSync(src)) {
      console.error('icon.png missing');
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(src).resize(256, 256).toFile(dest);
    console.log('generated dist/icon.ico');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
