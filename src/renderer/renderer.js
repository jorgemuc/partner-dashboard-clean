import { applyFilters, getFilterFields } from '../shared/filterUtils.mjs';
import { getData, setData } from './dataStore.js';
import { getStatusBuckets } from './utils.js';
import { renderKPIs, setChartsRef, showAlertsOverview } from './kpi.js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';
import { buildChart } from '../../chartWorker.mjs';
import './inlineEdit.js';
import './kpi.js';
let chartWorkerSrc = '';
async function loadWorkerSrc(){
  if(chartWorkerSrc) return;
  chartWorkerSrc = await (await fetch(
    new URL('../../chartWorker.mjs', import.meta.url)
  )).text();
}
// esbuild replaces import.meta.url; bundler keeps correct code path
window.Chart = Chart;

async function waitApi(){
  if(window.api?.libs && window.api?.version) return;
  await new Promise(r=>{
    const t=setInterval(()=>{
      if(window.api?.libs && window.api?.version){clearInterval(t);r();}
    },10);
  });
}

await waitApi();

const { mitt: Mitt } = window.api.libs || {};
const eventBus = window.api.bus;
const { utils: XLSXUtils = {}, writeFile = () => {} } = XLSX;
if(!Papa){ document.body.classList.add('no-csv'); console.error('CSV disabled'); }
if(!Chart){ document.body.classList.add('no-chart'); console.error('Charts disabled'); }
const demoBtn = document.getElementById('demoDataBtn');
if(demoBtn && !Papa) demoBtn.disabled = true;
const I18N={
  de:{demoBtn:"Demo-Daten laden"}
}; // TODO(Epic-9)
// TODO(Epic-8): Onboarding docs
// TODO(Epic-10): Portable build tweaks
// === GLOBAL DATA STRUCTURES ===
const referenceSchema = [
  "Partnername","Systemname","Partnertyp","Branche","Land","Website",
  "Vertragsstatus","Vertragstyp","Vertragsbeginn","Vertragsende","Kündigungsfrist",
  "Modul/Zweck","Schnittstelle","Format","API URL","Schnittstellenstatus",
  "Anzahl_Kunden","Anzahl_Liegenschaften","Anzahl_NE","Nutzungsfrequenz",
  "Störungen_90d","Score","Ansprechpartner_Name","Ansprechpartner_E-Mail",
  "Telefon","Rolle","Landingpage","Webinar_Termine","Marketingkampagne",
  "Produktflyer_URL","Präsentation_URL","Referenzprojekte","Schulungstypen",
  "Schulungsunterlagen","Trainingsstatus","Developer_Portal_Zugang",
  "Umsatz","Pipeline"
];

const headerAliases = {
  contract_start: "Vertragsbeginn",
  contract_end: "Vertragsende",
  partner_name: "Partnername",
  system_name: "Systemname",
  api_url: "API URL"
};

let csvHeaders = [];
let changelog = [];
let changeIndex = 0;

function pushChange(change){
  changeIndex = applyChange(getData(), change, changelog, changeIndex);
}
let charts = {};
setChartsRef(charts);
eventBus.on('chart:empty', id => {
  charts[id]?.destroy();
  delete charts[id];
});
let appVersion;
let chartWorker;

/**
 * Instantiate chart worker when allowed.
 * @returns {Worker|null}
 */
function createChartWorker(){
  if(window.location.protocol === 'file:') return null;
  try{
    const blob = new Blob([chartWorkerSrc], { type:'text/javascript' });
    const url = URL.createObjectURL(blob);
    const w = new Worker(url, { type:'module' });
    w.onmessage = e => {
      const {id, labels, values, empty} = e.data;
      if(empty){
        eventBus.emit('chart:empty', id);
      }else{
        drawChart(id, labels, values);
      }
    };
    return w;
  }catch(e){
    console.warn('worker failed', e);
    return null;
  }
}

async function prepareWorkers(){
  await loadWorkerSrc();
  chartWorker = createChartWorker();
  return () => { chartWorker?.terminate?.(); chartWorker = null; };
}
function resetCharts(){
  Object.values(charts).forEach(c=>c.destroy?.());
  charts={};
}
let demoMode = false;
let hiddenColumns = JSON.parse(localStorage.getItem('hiddenColumns')||'[]');
const columnViews = {
  Alle: [],
  Vertrag:["Partnername","Systemname","Vertragstyp","Vertragsstatus","Vertragsbeginn","Vertragsende","Kündigungsfrist"],
  Tech:["Partnername","Systemname","Schnittstelle","Format","API URL","Schnittstellenstatus","Developer_Portal_Zugang"],
  Onboarding:["Partnername","Systemname","Trainingsstatus","Schulungstypen","Schulungsunterlagen","Webinar_Termine"],
  Marketing:["Partnername","Systemname","Branche","Landingpage","Marketingkampagne","Produktflyer_URL","Präsentation_URL"],
  KPI:["Partnername","Systemname","Umsatz","Pipeline","Anzahl_Kunden","Anzahl_Liegenschaften","Anzahl_NE","Nutzungsfrequenz","Störungen_90d","Score"]
};
let currentPage = 1;
const rowsPerPage = 20;

function getVisibleColumns(){
  return csvHeaders.filter(h=>!hiddenColumns.includes(h));
}

function debounce(fn, wait=300) {
  let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); };
}


function applyView(name){
  const cols = columnViews[name] || csvHeaders;
  hiddenColumns = name==='Alle' ? [] : csvHeaders.filter(h=>!cols.includes(h));
  localStorage.setItem('hiddenColumns', JSON.stringify(hiddenColumns));
  renderTable();
  renderFilters();
}

// === TAB NAVIGATION ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'overview') renderOverview();
    if (btn.dataset.tab === 'table') renderTable();
    if (btn.dataset.tab === 'cards') renderCards();
    if (btn.dataset.tab === 'charts') renderCharts();
    if (btn.dataset.tab === 'changelog') renderChangelog();
  }
});

// === CSV IMPORT & PARSE ===

function validateCsvRaw(raw){
  const res = Papa.parse(raw,{skipEmptyLines:true});
  if(res.errors && res.errors.length){
    return {valid:false, errors:res.errors.map(e=>e.message)};
  }
  const cols = res.data[0] ? res.data[0].length : 0;
  const bad = res.data.some(r=>r.length!==cols);
  if(bad) return {valid:false, errors:["Inconsistent column count"]};
  return {valid:true, errors:[]};
}

function processCsvRaw(raw, statusEl){
  const progress = document.getElementById('csvProgress');
  if(progress){progress.style.display='block';progress.value=10;}
  if(statusEl) statusEl.textContent = 'Parsing...';
  const validation = validateCsvRaw(raw);
  if(!validation.valid){ showAlert('CSV Fehler: '+validation.errors.join('; '),'error'); if(progress) progress.style.display='none'; if(statusEl) statusEl.textContent=''; return; }
  const first = raw.split(/\r?\n/)[0] || '';
  const comma = (first.match(/,/g)||[]).length;
  const semi = (first.match(/;/g)||[]).length;
  const delimiter = semi > comma ? ';' : ',';
  Papa.parse(raw, {
    header: true,
    skipEmptyLines: true,
    delimiter,
    transformHeader: h => {
      const norm = h.trim();
      const key = norm.toLowerCase().replace(/[^a-z0-9]/g,'');
      return headerAliases[key] ||
        referenceSchema.find(r => r.toLowerCase().replace(/[^a-z0-9]/g,'')===key) ||
        norm;
    },
    complete: results => {
      const rows = results.data.map(r => {
        Object.keys(r).forEach(k => { if(r[k]==null) r[k]=''; });
        referenceSchema.forEach(f=>{ if(!(f in r)) r[f]=''; });
        return r;
      });
      const canon = s => s.toLowerCase().replace(/[^a-z0-9]/g,'');
      const parsed = results.meta.fields;
      const refCanon = referenceSchema.map(canon);
      const unexpected = parsed.filter(h => !refCanon.includes(canon(h)));
      csvHeaders = [...referenceSchema, ...unexpected];
      const missing = referenceSchema.filter(r => !parsed.map(canon).includes(canon(r)));
      const unexpectedMsg = unexpected.length ? ` Unerwartete Spalten: ${unexpected.join(', ')}.` : '';
      eventBus.emit('data:loaded', rows);
      let msg = `Import erfolgreich: ${rows.length} Partner geladen.`;
      if (missing.length) msg += ` Fehlende Spalten: ${missing.join(', ')}.`;
      msg += unexpectedMsg;
      showAlert(msg, 'success');
      changelog = [];
      currentPage = 1;
      // render handled by data:updated subscriber
    },
    error: err => showAlert("Fehler beim Parsen der CSV: "+err, "error")
  });
  if(progress) progress.style.display='none';
  if(statusEl) statusEl.textContent='';
}

function loadCsvFromString(str){
  processCsvRaw((str||'').replace(/^\uFEFF/, ''));
}

function handleFile(file){
  if(!file) return;
  demoMode=false;
  resetCharts();
  setData([]);
  csvHeaders=[];
  hiddenColumns = JSON.parse(localStorage.getItem('hiddenColumns')||'[]');
  document.getElementById('partnerTable').querySelector('tbody').innerHTML='';
  const reader = new FileReader();
  reader.onload = e => loadCsvFromString(e.target.result);
  reader.onerror = e => showAlert('Fehler beim Laden: '+e.target.error,'error');
  reader.readAsText(file,'utf-8');
}

function resetFilters(){
  document.querySelectorAll('#filters input').forEach(i=>{ i.value=''; });
  document.querySelectorAll('#partnerTable .filter-row input')
    .forEach(i=>{ i.value=''; });
}

function handleCsvLoaded(rows){
  setData(rows);
  currentPage = 1;
  resetFilters();
  renderAll();
}

function loadCsvFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try{
      const lib = window.api?.libs?.Papa || Papa;
      const res = lib.parse(e.target.result,{header:true,skipEmptyLines:true});
      handleCsvLoaded(res.data);
    }catch(err){
      console.error('CSV-Parse-Error', err);
    }
  };
  reader.onerror = err => console.error('CSV-Parse-Error', err);
  reader.readAsText(file,'utf-8');
}
window.loadCsvFile = loadCsvFile;

document.getElementById('csvFile').addEventListener('change', e => loadCsvFile(e.target.files[0]));

const dropZone = document.getElementById('dropZone');
if(dropZone){
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if(!f) return;
    if(f.type==='text/csv' || f.name.toLowerCase().endsWith('.csv')){
      const reader = new FileReader();
      reader.onload = ev => {
        try{
          const lib = window.api?.libs?.Papa || Papa;
          const res = lib.parse(ev.target.result,{header:true,skipEmptyLines:true});
          handleCsvLoaded(res.data);
        }catch(err){
          console.error('CSV-Parse-Error', err);
        }
      };
      reader.onerror = err => console.error('CSV-Parse-Error', err);
      reader.readAsText(f,'utf-8');
    }
  });
}

// === DEMO-DATEN ===
document.getElementById('demoDataBtn').onclick = () =>
  Papa.parse('./demo/PARTNER.csv', { download:true, header:true,
    complete: r => { setData(r.data); currentPage=1; resetFilters(); renderAll(); }
  });

eventBus.on('data:loaded', handleCsvLoaded);

// === INIT RENDER ALL ===
function renderAll() {
  renderOverview();
  renderColumnMenu();
  renderTable();
  renderFilters();
  renderCards();
  renderCharts();
}
eventBus.on('data:updated', () => {
  renderAll();
  renderChangelog();
});
window.onload = async () => {
  if (localStorage.getItem('prefers-dark') === 'true') {
    document.body.classList.add('dark');
  }
  document.getElementById('darkModeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('prefers-dark', document.body.classList.contains('dark'));
  };
  applyView('Alle');
  const cleanupWorkers = await prepareWorkers();
  window.addEventListener('beforeunload', cleanupWorkers);
  window.initInlineEdit?.();
  document.getElementById('columnBtn').onclick = () => {
    const menu = document.getElementById('columnMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  };
  document.getElementById('viewSelect').onchange = function(){
    applyView(this.value);
  };
  document.getElementById('prevPage').onclick = ()=>{ if(currentPage>1){ currentPage--; renderTable(); }};
  document.getElementById('nextPage').onclick = ()=>{ currentPage++; renderTable(); };
  document.getElementById('undoBtn').onclick = undoChange;
  document.getElementById('redoBtn').onclick = redoChange;
  document.getElementById('alertsSettingsBtn').onclick = showAlertsOverview;
};

// === UI MESSAGES ===
// moved to ./ui/toast.js

function renderOverview(){
  if(appVersion) renderKPIs(appVersion);
}

// tolerate missing preload bridge in jsdom/Jest
(function(){
  const version = window.api?.version || 'dev-test';
  appVersion = version;
  window.showVersion = () => alert(`Version ${version}`);
  const titleEl = document.getElementById('appTitle');
  if (titleEl) titleEl.textContent = `Partner-Dashboard v${version}`;
  renderAll();
})();

// signal successful bootstrap for tests
document.body.setAttribute('data-testid', 'app-ready');
// Signal an Playwright-Smoke, dass die App fertig ist
window.api?.bus?.emit?.('e2e-ready');


// === KPIs ===

// === FILTER + EXPORT ===
function detectType(field) {
  return "text";
}
function renderFilters() {
  const div = document.getElementById('filters');
  const thead = document.getElementById('partnerTable').querySelector('thead');
  const data = getData();
  if (!data.length) { div.innerHTML=''; thead.querySelector('.filter-row')?.remove(); return; }
  const presets = JSON.parse(localStorage.getItem('filterPresets')||'[]');
  const view = document.getElementById('viewSelect').value || 'Alle';
  const fields = getFilterFields(view, getVisibleColumns());
  let html = `<input type="text" id="searchInput" placeholder="Suche...">`;
  fields.forEach(h=>{ html+=`<input type="text" id="filter_${h}" placeholder="${h}">`; });
  html += `<select id="presetSelect"><option value="">Preset wählen</option>`+
    presets.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('')+`</select>`;
  html += `<button id="savePreset" class="export-btn" style="background:#888;">Preset speichern</button>`;
  html += `<button class="export-btn" onclick="exportTableCSV()" ${!Papa?'disabled':''}>CSV Export</button>`;
  html += `<button class="export-btn" onclick="exportTableXLSX()" ${!XLSX?'disabled':''}>XLSX Export</button>`;
  thead.querySelector('.filter-row')?.remove();
  if(csvHeaders.length>20){
    div.innerHTML='';
    thead.insertAdjacentHTML('beforeend', `<tr class="filter-row"><th colspan="${csvHeaders.length+1}"><div class="search-filter">${html}</div></th></tr>`);
  } else {
    div.innerHTML = html;
  }
  document.getElementById('searchInput').oninput = debounce(renderTable,300);
  fields.forEach(h=>{document.getElementById(`filter_${h}`).oninput = debounce(renderTable,300);});
  document.getElementById('savePreset').onclick = savePreset;
  document.getElementById('presetSelect').onchange = function(){ const idx=this.value; if(idx==='') return; const p=presets[idx]; if(p) applyFilters(p.filters); };
}
function getCurrentFilters(){
  const obj={};
  getVisibleColumns().forEach(h=>{
    const val=document.getElementById(`filter_${h}`)?.value;
    if(val) obj[h]=val;
  });
  obj.search=document.getElementById('searchInput').value;
  return obj;
}
function savePreset(){
  const name=prompt('Preset Name?');
  if(!name) return;
  const presets=JSON.parse(localStorage.getItem('filterPresets')||'[]');
  presets.push({name,filters:getCurrentFilters()});
  localStorage.setItem('filterPresets',JSON.stringify(presets));
  renderFilters();
}
function getFilteredData(){
  const search = document.getElementById('searchInput')?.value || '';
  const filters = {};
  getVisibleColumns().forEach(h => {
    const val = document.getElementById(`filter_${h}`)?.value;
    if (val) filters[h] = val;
  });
  return applyFilters(getData(), { search, filters });
}

function renderColumnMenu(){
  if(!csvHeaders.length){document.getElementById('columnMenu').innerHTML='';return;}
  hiddenColumns = hiddenColumns.filter(c=>csvHeaders.includes(c));
  const menu = csvHeaders.map(h=>`<label style="display:block"><input type="checkbox" data-col="${h}" ${hiddenColumns.includes(h)?'':'checked'}> ${h}</label>`).join('');
  const cm = document.getElementById('columnMenu');
  cm.innerHTML = menu;
  document.querySelectorAll('#columnMenu input').forEach(cb=>{
    cb.onchange = () => {
      const col = cb.dataset.col;
      if(!cb.checked){ if(!hiddenColumns.includes(col)) hiddenColumns.push(col); }
      else hiddenColumns = hiddenColumns.filter(c=>c!==col);
      localStorage.setItem('hiddenColumns', JSON.stringify(hiddenColumns));
      renderTable();
    };
  });
}

// === TABELLE + EDITOR ===
function renderTable() {
  const data = getData();
  if (!data.length) {
    document.getElementById("partnerTable").querySelector("thead").innerHTML = "";
    document.getElementById("partnerTable").querySelector("tbody").innerHTML = "";
    return;
  }
  let ths = csvHeaders.map(h=>`<th data-col="${h}" class="${hiddenColumns.includes(h)?'hidden':''}">${h}</th>`).join("") + "<th>Aktion</th>";
  document.getElementById("partnerTable").querySelector("thead").innerHTML = `<tr>${ths}</tr>`;
  const filtered = getFilteredData();
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  if(currentPage>totalPages) currentPage = totalPages;
  let rows = "";
  filtered.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage).forEach((row,idx) => {
    const ridx = data.indexOf(row);
    let tds = csvHeaders.map(h=>`<td data-row="${ridx}" data-col="${h}" class="${hiddenColumns.includes(h)?'hidden':''}">${row[h]||""}</td>`).join("");
    tds += `<td><button class="edit-btn" onclick="openEditor(${data.indexOf(row)})">Edit</button></td>`;
    rows += `<tr>${tds}</tr>`;
  });
  document.getElementById("partnerTable").querySelector("tbody").innerHTML = rows;
  document.getElementById('pageInfo').textContent = `${currentPage}/${totalPages}`;
}

// === KARTEN ===
function renderCards() {
  const cardsDiv = document.getElementById("partnerCards");
  const data = getData();
  if (!data.length) { cardsDiv.innerHTML = ""; return; }
  const search = (document.getElementById("cardSearchInput")?.value||"").toLowerCase();
  const grouped = {};
  data.forEach(r => {
    if (!grouped[r.Partnername]) grouped[r.Partnername]=[];
    grouped[r.Partnername].push(r);
  });
  cardsDiv.innerHTML = Object.keys(grouped).filter(partner =>
    partner.toLowerCase().includes(search)
  ).map(partner => {
    const sysList = grouped[partner].map(r => `
      <div style="margin-bottom:0.6rem;padding:0.6rem;background:#f5f6fa;border-radius:0.6rem;">
        <b>System:</b> ${r.Systemname||""}<br>
        <b>Partnertyp:</b> ${r.Partnertyp||""}<br>
        <b>Vertragstyp:</b> ${r.Vertragstyp||""}<br>
        <b>Vertragsstatus:</b> ${r.Vertragsstatus||""}<br>
        <b>Score:</b> ${r.Score||""}<br>
        <b>DevPortal:</b> ${r.Developer_Portal_Zugang||""}
      </div>
    `).join('');
    return `<div class="card"><h3>${partner}</h3>${sysList}</div>`;
  }).join('');
  document.getElementById("cardSearchInput").oninput = renderCards;
}

// === POPUP EDITOR ===
window.openEditor = function(idx) {
  const data = getData();
  const row = {...data[idx]};
  let html = `<input type="hidden" id="editIdx" value="${idx}">`;
  csvHeaders.forEach(h => {
      html += `<label>${h}<input type="text" id="edit_${h.replace(/[^\w\-]/g,"_")}" value="${row[h]||""}"></label>`;
  });
  html += `<div class="modal-actions"><button type="submit" class="export-btn" style="background:#32b14d;">Speichern</button></div>`;
  document.getElementById("editForm").innerHTML = html;
  document.getElementById("modalBg").style.display = "block";
  document.getElementById("editForm").onsubmit = function(e) {
    e.preventDefault();
    let changed = false;
    csvHeaders.forEach(h => {
      const safeId = h.replace(/[^\w\-]/g,"_");
      const oldVal = data[idx][h]||"";
      const newVal = document.getElementById(`edit_${safeId}`).value;
      if (oldVal !== newVal) {
        pushChange({
          index: idx,
          field: h,
          old: oldVal,
          new: newVal,
          partner: data[idx].Partnername,
          system: data[idx].Systemname,
          type:'edit',
          ts: Date.now()
        });
        changed = true;
      }
    });
    document.getElementById("modalBg").style.display = "none";
    if (changed) { setData(data); showAlert("Änderung gespeichert!","success"); }
  };
  document.getElementById("modalCloseBtn").onclick = ()=>{ document.getElementById("modalBg").style.display = "none"; }
};

// === CHANGELOG ===
function renderChangelog() {
  let html = changelog.slice(0, changeIndex).map(l =>
    `<tr>
      <td>${l.time}</td>
      <td>${l.field}</td>
      <td>${l.old}</td>
      <td>${l.new}</td>
      <td>${l.partner}</td>
      <td>${l.system}</td>
    </tr>`
  ).join('');
  document.getElementById("changelogTable").querySelector("tbody").innerHTML = html;
}

window.undoChange = function(){
  changeIndex = undo(getData(), changelog, changeIndex);
  eventBus.emit('data:updated', getData());
  showAlert('Undo','success');
};

window.redoChange = function(){
  changeIndex = redo(getData(), changelog, changeIndex);
  eventBus.emit('data:updated', getData());
  showAlert('Redo','success');
};

// === CSV EXPORT ===
window.exportTableCSV = function() {
  const headers = getVisibleColumns();
  const rows = [headers];
  getFilteredData().forEach(r => {
    rows.push(headers.map(h => r[h]||""));
  });
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv],{type:"text/csv"});
  Object.assign(document.createElement('a'),{
    href: URL.createObjectURL(blob),
    download: 'partner_export.csv'
  }).click();
};

window.exportTableXLSX = function(){
  const headers = getVisibleColumns();
  const data = getFilteredData().map(r => {
    const obj = {};
    headers.forEach(h=>{obj[h]=r[h]||"";});
    return obj;
  });
  const ws = XLSXUtils.json_to_sheet(data,{header:headers});
  const wb = XLSXUtils.book_new();
  XLSXUtils.book_append_sheet(wb, ws, 'Partner');
  writeFile(wb, 'partner_export.xlsx');
};

// === CHARTS ===
function renderCharts() {
  const data = getData();
  if (!data.length) return;
  if(!Chart){ showAlert('Charts disabled','error'); return; }
  const mapping = {
    pieVertragstyp: 'Vertragstyp',
    pieDevPortal: 'Developer_Portal_Zugang',
    barPartnertyp: 'Partnertyp',
    barTraining: 'Trainingsstatus'
  };
  Object.entries(mapping).forEach(([id, field]) => {
    charts[id]?.destroy();
    if(chartWorker){
      chartWorker.postMessage({id, field, rows:data});
    }else if(buildChart){
      const {labels, values} = buildChart(field, data);
      drawChart(id, labels, values);
    }
  });
}

/**
 * Render a single chart on the page.
 * @param {string} canvasId
 * @param {string[]} labels
 * @param {number[]} values
 */
function drawChart(canvasId, labels, values){
  const canvas = document.getElementById(canvasId);
  const ctx = canvas?.getContext?.('2d');
  if(!ctx) return;
  const type = canvasId.startsWith('pie') ? 'pie' : 'bar';
  if(charts[canvasId]) charts[canvasId].destroy();
  charts[canvasId] = new Chart(ctx, {
    type,
    data: { labels, datasets:[{data: values}] },
    options: { responsive:true, plugins:{legend:{position:type==='pie'?'bottom':'none'}} }
  });
}

export { loadCsvFile, handleCsvLoaded };
