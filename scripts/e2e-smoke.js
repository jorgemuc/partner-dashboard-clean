const fs = require('fs');
const path = require('path');
const {JSDOM, ResourceLoader} = require('jsdom');

async function run(){
  const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const dom = new JSDOM(html,{runScripts:'dangerously',resources:new (class extends ResourceLoader{
      fetch(url,options){
        if(url.startsWith('https://app.local')){
          const p = path.join(__dirname,'..',url.replace('https://app.local/',''));
          return Promise.resolve(fs.readFileSync(p));
        }
        if(url.includes('cdn.jsdelivr')){
          return Promise.resolve(Buffer.from(''));
        }
        return super.fetch(url,options);
      }
    })(),url:'https://app.local'});
  const errors=[];
  const origErr = console.error;
  dom.window.console.error = (...a)=>{ errors.push(a.join(' ')); origErr(...a); };
  await new Promise(r=>dom.window.addEventListener('load',r));
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.sessionStorage = dom.window.sessionStorage;
  global.window.api = {version:()=>Promise.resolve('0.0.0'),onOpenCsvDialog:()=>{}};
  dom.window.HTMLCanvasElement.prototype.getContext = () => ({})
  global.window.api = {
    bus: require('mitt')(),
    libs: {}
  };

  // —— IPC-Ready-Signal zum Smoke-Test ————————————————
  global.window.api.bus.emit('e2e-ready');
  await import('../dist/renderer.bundle.js');
  if(dom.window.document.body.classList.contains('no-csv') ||
     dom.window.document.body.classList.contains('no-chart')){
    console.error('feature flags active', dom.window.document.body.className);
    process.exit(1);
  }
  dom.window.document.getElementById('demoDataBtn').click();
  await new Promise(r=>setTimeout(r,100));
  const boxes = dom.window.document.querySelectorAll('#kpiBoxes .kpi');
  let text = '';
  boxes.forEach(b=>{if(/Partner/.test(b.textContent)) text=b.textContent;});
  if(errors.some(e=>e.includes('module specifier'))){
    console.error('module specifier', errors);
    process.exit(1);
  }
  if(/^[1-9].*Partner/.test(text)){
    console.log('smoke ok');
    process.exit(0);
  }else{
    console.error('smoke fail', text);
    process.exit(1);
  }
}
run();
