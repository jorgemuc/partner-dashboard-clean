const fs = require('fs');
const path = require('path');

const iconB64 = path.join(__dirname, '..', 'assets', 'icons', 'partner_dashboard_icon_1024.png.b64');
const iconPng = path.join(__dirname, '..', 'assets', 'icons', 'partner_dashboard_icon_1024.png');
if (!fs.existsSync(iconPng)) {
  const data = fs.readFileSync(iconB64, 'utf8');
  fs.writeFileSync(iconPng, Buffer.from(data, 'base64'));
  console.log('decoded icon');
}

const baseB64 = path.join(__dirname, '..', 'assets', 'icons', 'icon.png.b64');
const basePng = path.join(__dirname, '..', 'assets', 'icons', 'icon.png');
if (!fs.existsSync(basePng) && fs.existsSync(baseB64)) {
  const data = fs.readFileSync(baseB64, 'utf8');
  fs.writeFileSync(basePng, Buffer.from(data, 'base64'));
  console.log('decoded base icon');
}

const rootPng = path.join(__dirname, '..', 'assets', 'icon.png');
if (!fs.existsSync(rootPng) && fs.existsSync(baseB64)) {
  const data = fs.readFileSync(baseB64, 'utf8');
  fs.writeFileSync(rootPng, Buffer.from(data, 'base64'));
  console.log('decoded root icon');
}

