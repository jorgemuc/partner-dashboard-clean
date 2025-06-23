const fs = require('fs');
const path = require('path');

const iconB64 = path.join(__dirname, '..', 'assets', 'icons', 'partner_dashboard_icon_1024.png.b64');
const iconPng = path.join(__dirname, '..', 'assets', 'icons', 'partner_dashboard_icon_1024.png');
if (!fs.existsSync(iconPng)) {
  const data = fs.readFileSync(iconB64, 'utf8');
  fs.writeFileSync(iconPng, Buffer.from(data, 'base64'));
  console.log('decoded icon');
}

