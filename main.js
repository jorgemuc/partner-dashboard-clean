const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');

ipcMain.handle('getVersion', () => app.getVersion());

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
      {label:'Info',click:()=>dialog.showMessageBox(win,{message:`${app.getName()}  v${app.getVersion()}`})},
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

if (require.main === module) {
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

module.exports = { getMenuTemplate, createMenu };
