const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { parseCsv } = require('./parser');

ipcMain.handle('getVersion', () => app.getVersion());

const columnViews = {
  Alle: [],
  Vertrag:["Partnername","Systemname","Vertragstyp","Vertragsstatus","Vertragsbeginn","Vertragsende","Kündigungsfrist"],
  Tech:["Partnername","Systemname","Schnittstelle","Format","API URL","Schnittstellenstatus","Developer_Portal_Zugang"],
  Onboarding:["Partnername","Systemname","Trainingsstatus","Schulungstypen","Schulungsunterlagen","Webinar_Termine"],
  Marketing:["Partnername","Systemname","Branche","Landingpage","Marketingkampagne","Produktflyer_URL","Präsentation_URL"],
  KPI:["Partnername","Systemname","Anzahl_Kunden","Anzahl_Liegenschaften","Anzahl_NE","Nutzungsfrequenz","Störungen_90d","Score"]
};

// simple state for tests
let __rows = [];
let __headers = [];

function getMenuTemplate(win){
  return [
    {label:'File',submenu:[
      {label:'Info',click:()=>win.webContents.send('show-info')},
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
        const about=new BrowserWindow({parent:win,modal:true,width:400,height:300,title:'About',webPreferences:{nodeIntegration:true,contextIsolation:false}});
        about.setMenu(null);
        about.loadFile('about.html');
      }},
      {label:'Hilfe (Online README)',click:()=>{
        const help=new BrowserWindow({width:600,height:700,title:'Hilfe'});
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
    webPreferences:{nodeIntegration:true,contextIsolation:false}
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  createMenu(win);
}

function loadCsv(file){
  const raw = fs.readFileSync(file, 'utf8');
  const res = parseCsv(raw);
  __rows = res.data;
  __headers = [...res.data.length ? Object.keys(res.data[0]) : []];
}

function getTableRows(){
  return __rows.map(r => __headers.map(h => r[h]));
}

function _reset(){
  __rows = [];
  __headers = [];
}

if (require.main === module) {
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

module.exports = { getMenuTemplate, createMenu, loadCsv, getTableRows, _reset };
