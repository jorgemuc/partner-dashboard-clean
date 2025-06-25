import { getData, setData } from './dataStore.js';
import bus from './eventBus.js';
import { getStatusBuckets } from './utils.js';
import { renderKPIs, setChartsRef } from './kpi.js';
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
let charts = {};
setChartsRef(charts);
let appVersion;
let chartWorker;
let buildChart;

/**
 * Instantiate chart worker when allowed.
 * @returns {Worker|null}
 */
function createChartWorker(){
  if(window.location.protocol === 'file:') return null;
  try{
    const w = new Worker(new URL('chartWorker.js', window.location.href));
    w.onmessage = e => {
      const {id, labels, values} = e.data;
      drawChart(id, labels, values);
    };
    return w;
  }catch(e){
    console.warn('worker failed', e);
    return null;
  }
}

async function prepareWorkers(){
  if(!buildChart){
    const url = new URL('../../chartWorker.js', import.meta.url);
    const m = await import(url);
    buildChart = m.buildChart;
  }
  chartWorker = createChartWorker();
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
    if (btn.dataset.tab === "charts") renderCharts();
    if (btn.dataset.tab === "changelog") renderChangelog();
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

function handleFile(file){
  if(!file) return;
  // 🔄 reset global state on every import
  demoMode=false;
  resetCharts();
  setData([]);
  csvHeaders=[];
  hiddenColumns = JSON.parse(localStorage.getItem('hiddenColumns')||'[]');
  document.getElementById('partnerTable').querySelector('tbody').innerHTML='';
  const finish = raw => {
    const validation = validateCsvRaw(raw);
    if(!validation.valid){ showMsg('CSV Fehler: '+validation.errors.join('; '),'error'); return; }
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
        setData(rows);
        let msg = `Import erfolgreich: ${rows.length} Partner geladen.`;
        if (missing.length) msg += ` Fehlende Spalten: ${missing.join(', ')}.`;
        msg += unexpectedMsg;
        showMsg(msg, 'success');
        changelog = [];
        currentPage = 1;
        // render handled by data:updated subscriber
      },
      error: err => showMsg("Fehler beim Parsen der CSV: "+err, "error")
    });
  };
  const reader = new FileReader();
  reader.onload = e => finish((e.target.result||'').replace(/^\uFEFF/, ''));
  reader.readAsText(file,'UTF-8');
}

document.getElementById('csvFile').addEventListener('change', e => handleFile(e.target.files[0]));
document.body.addEventListener('dragover', e => { e.preventDefault(); });
document.body.addEventListener('drop', e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); });

// === DEMO-DATEN ===
function loadDemoData(){
  demoMode=true;
  resetCharts();
  let rows = [
    {"Partnername":"Aareon AG","Systemname":"Blue Eagle","Partnertyp":"ERP","Branche":"Wohnungswirtschaft","Land":"DE",
      "Webseite":"https://aareon.de","Vertragsstatus":"Laufend","Vertragstyp":"AVV","Score":"91","Developer_Portal_Zugang":"Ja","Trainingsstatus":"Abgeschlossen"},
    {"Partnername":"Aareon AG","Systemname":"Wodis Yuneo","Partnertyp":"ERP","Branche":"Wohnungswirtschaft","Land":"DE",
      "Webseite":"https://aareon.de","Vertragsstatus":"Laufend","Vertragstyp":"SLA","Score":"89","Developer_Portal_Zugang":"Ja","Trainingsstatus":"Offen"},
    {"Partnername":"Hausbank München","Systemname":"VS3","Partnertyp":"ERP","Branche":"Banken","Land":"DE",
      "Webseite":"https://hausbank.de","Vertragsstatus":"Laufend","Vertragstyp":"Lizenz","Score":"74","Developer_Portal_Zugang":"Nein","Trainingsstatus":"Offen"},
    {"Partnername":"DOMUS GmbH","Systemname":"DOMUS 1000","Partnertyp":"ERP","Branche":"Wohnungswirtschaft","Land":"DE",
      "Webseite":"https://domus.de","Vertragsstatus":"Laufend","Vertragstyp":"AVV","Score":"63","Developer_Portal_Zugang":"Nein","Trainingsstatus":"Abgeschlossen"}
  ];
  rows = rows.map(r=>{referenceSchema.forEach(f=>{if(!(f in r)) r[f]='';}); return r;});
  csvHeaders = [...referenceSchema];
  showMsg("Demo-Daten geladen.", "success");
  changelog = [];
  currentPage = 1;
  setData(rows);
}
document.getElementById('demoDataBtn').onclick = loadDemoData;

// === INIT RENDER ALL ===
function renderAll() {
  if(appVersion) renderKPIs(appVersion);
  renderColumnMenu();
  renderTable();
  renderFilters();
  renderCards();
  renderCharts();
}
bus.on('data:updated', () => {
  renderTable();
  renderFilters();
  renderCards();
  if(appVersion) renderKPIs(appVersion);
  renderCharts();
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
  await prepareWorkers();
  loadDemoData();
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
};

// === UI MESSAGES ===
function showMsg(txt, type="success") {
  const msgDiv = document.getElementById("msg");
  msgDiv.innerHTML = `<span class="${type}-msg">${txt}</span>`;
  setTimeout(() => { msgDiv.innerHTML = ""; }, 4000);
}

// tolerate missing preload bridge in jsdom/Jest
(async () => {
  const version =
    window?.electronAPI?.getVersion
      ? await window.electronAPI.getVersion()
      : 'dev-test'; // fallback for unit & smoke tests

  appVersion = version;
  window.showVersion = () => alert(`Version ${version}`);
  renderKPIs(version);
})();

// CSV-Menü aus Preload registrieren –  jsdom hat keine Bridge
window?.electronAPI?.onOpenCsvDialog?.(() => document.getElementById('csvFile').click());

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
  html += `<button class="export-btn" onclick="exportTableCSV()">CSV Export</button>`;
  html += `<button class="export-btn" onclick="exportTableXLSX()">XLSX Export</button>`;
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
function applyFilters(f){
  document.getElementById('searchInput').value=f.search||'';
  getVisibleColumns().forEach(h=>{
    if(f[h]) document.getElementById(`filter_${h}`).value=f[h];
  });
  renderTable();
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
  const search=(document.getElementById('searchInput')?.value||'').toLowerCase();
  const headers=getVisibleColumns();
  return getData().filter(r=>{
    if(search && !Object.values(r).some(v=>String(v||'').toLowerCase().includes(search))) return false;
    for(const h of headers){
      const val=document.getElementById(`filter_${h}`)?.value.toLowerCase();
      if(val && !String(r[h]||'').toLowerCase().includes(val)) return false;
    }
    return true;
  });
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
    let tds = csvHeaders.map(h=>`<td data-col="${h}" class="${hiddenColumns.includes(h)?'hidden':''}">${row[h]||""}</td>`).join("");
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
        data[idx][h] = newVal;
        changelog.splice(changeIndex);
        changelog.push({
          time: new Date().toLocaleString(),
          index: idx,
          field: h,
          old: oldVal,
          new: newVal,
          partner: data[idx].Partnername,
          system: data[idx].Systemname
        });
        if(changelog.length>5){ changelog.shift(); }
        changeIndex = changelog.length;
        changed = true;
      }
    });
    document.getElementById("modalBg").style.display = "none";
    if (changed) { setData(data); showMsg("Änderung gespeichert!","success"); }
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
  if(changeIndex===0) return;
  const c = changelog[changeIndex-1];
  const data = getData();
  data[c.index][c.field] = c.old;
  setData(data);
  changeIndex--;
  showMsg('Undo','success');
};

window.redoChange = function(){
  if(changeIndex===changelog.length) return;
  const c = changelog[changeIndex];
  const data = getData();
  data[c.index][c.field] = c.new;
  setData(data);
  changeIndex++;
  showMsg('Redo','success');
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
  const ws = XLSX.utils.json_to_sheet(data,{header:headers});
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Partner');
  const out = XLSX.write(wb,{bookType:'xlsx',type:'array'});
  const blob = new Blob([out],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  Object.assign(document.createElement('a'),{
    href: URL.createObjectURL(blob),
    download: 'partner_export.xlsx'
  }).click();
};

// === CHARTS ===
function renderCharts() {
  const data = getData();
  if (!data.length) return;
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
  const ctx = document.getElementById(canvasId).getContext('2d');
  const type = canvasId.startsWith('pie') ? 'pie' : 'bar';
  if(charts[canvasId]) charts[canvasId].destroy();
  charts[canvasId] = new Chart(ctx, {
    type,
    data: { labels, datasets:[{data: values}] },
    options: { responsive:true, plugins:{legend:{position:type==='pie'?'bottom':'none'}} }
  });
}
