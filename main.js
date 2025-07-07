const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const fs = require('fs');
const { parseCsv } = require('./src/utils/parser');
const path = require('path');
const PRELOAD = path.join(__dirname, '..', 'dist', 'preload.js');
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
      {label:'CSV laden…', click: async (_item, win) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
          properties:['openFile'],
          filters:[{ name:'CSV', extensions:['csv'] }]
        });
        if(!canceled && filePaths[0]) win.webContents.send('open-csv-dialog', filePaths[0]);
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
            preload:PRELOAD
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
            preload:PRELOAD
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
      preload:PRELOAD
    }
  });
  win.loadFile('index.html');
  // ----------  E2E Smoke-Test Handshake ----------
  win.webContents.once('did-finish-load', () => {
    win.webContents.send('app-loaded'); // guarantees the renderer is ready
    if (process.send) process.send('app-loaded');
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
