const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const fs = require('fs');
const { parseCsv } = require('./src/utils/parser');
const path = require('path');
const PRELOAD = path.join(__dirname, 'preload.js');
let mainWindow;
// works in dev (npm start) and in the packed ASAR
const nodemailer = require('nodemailer');

ipcMain.handle('get-version', () => app.getVersion());
ipcMain.handle('send-mail', async (_e, opts) => {
  if (process.env.DEV_FLAG === 'true') return { sent:false };
  const host = process.env.SMTP_HOST;
  if(!host) return { sent:false };
  try{
    const transport = nodemailer.createTransport({ host });
    await transport.sendMail(opts);
    return { sent:true };
  }catch(e){
    console.error('[pl-err] mail failed', e);
    return { sent:false };
  }
});

ipcMain.handle('dialog:openCsv', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters:[{name:'CSV', extensions:['csv']}],
    properties:['openFile']
  });
  if (!canceled) mainWindow.webContents.send('csv:path', filePaths[0]);
});

const columnViews = {
  Alle: [],
  Vertrag:["Partnername","Systemname","Vertragstyp","Vertragsstatus","Vertragsbeginn","Vertragsende","Kündigungsfrist"],
  Tech:["Partnername","Systemname","Schnittstelle","Format","API URL","Schnittstellenstatus","Developer_Portal_Zugang"],
  Onboarding:["Partnername","Systemname","Trainingsstatus","Schulungstypen","Schulungsunterlagen","Webinar_Termine"],
  Marketing:["Partnername","Systemname","Branche","Landingpage","Marketingkampagne","Produktflyer_URL","Präsentation_URL"],
  KPI:["Partnername","Systemname","Anzahl_Kunden","Anzahl_Liegenschaften","Anzahl_NE","Nutzungsfrequenz","Störungen_90d","Score"]
};

function getMenuTemplate(win){
  return [
    { label:'File',
      submenu:[
        { label:'CSV laden…', id:'openCsv', click: () =>
            mainWindow.webContents.send('menu-open-csv') },
        { role:'quit' }
      ]},
    {label:'View',submenu:[
      {role:'reload'},
      {role:'forcereload'},
      {type:'separator'},
      {label:'Toggle Developer Tools',
        accelerator:process.platform==='darwin'?'Alt+Command+I':'Ctrl+Shift+I',
        click:(_,w)=>w&&w.webContents.toggleDevTools()}
    ]},
    {label:'Help',submenu:[
      {label:'About ...',click:()=>{
        const about=new BrowserWindow({
          parent:win,
          modal:true,
          width:400,
          height:300,
          title:'About',
          webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            preload:PRELOAD
          }
        });
        about.setMenu(null);
        about.loadFile(require('path').join(__dirname, 'about.html'));
      }},
      {label:'Hilfe (Online README)',click:()=>{
        const help=new BrowserWindow({
          width:600,
          height:700,
          title:'Hilfe',
          webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            preload:PRELOAD
          }
        });
        help.setMenu(null);
        help.loadFile(require('path').join(__dirname, 'help.html'));
      }}]}
  ];
}

function createMenu(win){
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate(win)));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: `Partner-Dashboard v${app.getVersion()}`,
    webPreferences:{
      nodeIntegration:false,
      contextIsolation:true,
      preload:PRELOAD
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('app-loaded');
    if (process.send) process.send('app-loaded');
    ipcMain.emit('app-loaded');
  });
  createMenu(mainWindow);
}

if (require.main === module) {
  if (process.env.DUMP_ENV === '1') {
    console.error('[diag] env', JSON.stringify({
      platform: process.platform,
      versions: process.versions,
      display: process.env.DISPLAY,
      cwd: process.cwd()
    }, null, 2));
  }
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

module.exports = { getMenuTemplate, createMenu };

// test helpers
let _rows = [];
function loadCsv(fp){
  const raw = fs.readFileSync(fp,'utf8');
  _rows = parseCsv(raw).data;
}
function getTableRows(){
  return _rows;
}
function _reset(){
  _rows = [];
}

module.exports.loadCsv = loadCsv;
module.exports.getTableRows = getTableRows;
module.exports._reset = _reset;
