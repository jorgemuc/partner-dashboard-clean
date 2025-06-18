const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const pkg = require('./package.json');

const columnViews = {
  Alle: [],
  Vertrag:["Partnername","Systemname","Vertragstyp","Vertragsstatus","Vertragsbeginn","Vertragsende","Kündigungsfrist"],
  Tech:["Partnername","Systemname","Schnittstelle","Format","API URL","Schnittstellenstatus","Developer_Portal_Zugang"],
  Onboarding:["Partnername","Systemname","Trainingsstatus","Schulungstypen","Schulungsunterlagen","Webinar_Termine"],
  Marketing:["Partnername","Systemname","Branche","Landingpage","Marketingkampagne","Produktflyer_URL","Präsentation_URL"],
  KPI:["Partnername","Systemname","Anzahl_Kunden","Anzahl_Liegenschaften","Anzahl_NE","Nutzungsfrequenz","Störungen_90d","Score"]
};

function createMenu(win){
  const template=[
    {label:'File',submenu:[
      {label:'Info',click:()=>dialog.showMessageBox(win,{message:`Version ${pkg.appVersion}`})},
      {role:'quit'}]},
    {label:'Help',submenu:[
      {label:'About ...',click:()=>{
        const about=new BrowserWindow({parent:win,modal:true,width:400,height:300,title:'About'});
        about.setMenu(null);
        about.loadFile('about.html',{query:{v:pkg.appVersion}});
      }},
      {label:'Hilfe (Online README)',click:()=>{
        const help=new BrowserWindow({width:600,height:700,title:'Hilfe'});
        help.setMenu(null);
        help.loadFile('help.html');
      }}]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: `Partner-Dashboard v${pkg.appVersion}`
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  if (app.isPackaged) win.webContents.openDevTools();
  createMenu(win);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
