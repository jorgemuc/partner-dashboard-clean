const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const fs = require('fs');
const { parseCsv } = require('./parser');
const path = require('path');

ipcMain.handle('get-version', () => app.getVersion());

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
    {label:'File',submenu:[
      {label:'CSV laden…', click: (_item, focusedWindow) => {
        focusedWindow.webContents.send('open-csv-dialog');
      }},
      {role:'quit'}]},
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
            preload:path.join(__dirname,'src','preload.mjs')
          }
        });
        about.setMenu(null);
        about.loadFile('about.html');
      }},
      {label:'Hilfe (Online README)',click:()=>{
        const help=new BrowserWindow({
          width:600,
          height:700,
          title:'Hilfe',
          webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            preload:path.join(__dirname,'src','preload.mjs')
          }
        });
        help.setMenu(null);
        help.loadFile('help.html');
      }}]}
  ];
}

function createMenu(win){
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate(win)));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: `Partner-Dashboard v${app.getVersion()}`,
    webPreferences:{
      nodeIntegration:false,
      contextIsolation:true,
      preload:path.join(__dirname,'src','preload.mjs')
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  // ----------  E2E Smoke-Test Handshake ----------
  win.webContents.once('did-finish-load', () => {
    win.webContents.send('app-loaded'); // guarantees the renderer is ready
  });
  createMenu(win);
}

if (require.main === module) {
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
