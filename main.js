const {app, BrowserWindow} = require('electron');
const path = require('path');

function create () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
