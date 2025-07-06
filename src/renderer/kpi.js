import { getData } from './dataStore.js';
import { getStatusBuckets } from './utils.js';
import { createModal } from './modal.js';
import { showMsg } from './ui/toast.js';
let charts = {};
export function setChartsRef(obj){ charts = obj; }

export function initKpiAlerts(){
  document.querySelectorAll('.kpi').forEach(div => {
    const icon = document.createElement('span');
    icon.className = 'gear';
    icon.textContent = '⚙️';
    icon.setAttribute('aria-label','Schwellwert anpassen');
    if(!div.querySelector('.gear')){
      div.appendChild(icon);
      icon.onclick = async e => {
        e.stopPropagation();
        const mod = await import('./thresholdModal.js');
        mod.openThresholdModal(div.dataset.kpi);
      };
    }
  });
}
window.initKpiAlerts = initKpiAlerts;

export function getThresholds(){
  return JSON.parse(localStorage.getItem('kpiThresholds')||'{}');
}

export function thresholdStore(cfg){
  localStorage.setItem('kpiThresholds', JSON.stringify(cfg));
  return cfg;
}

export function validateOperator(op){
  return ['<','>','='].includes(op);
}

export function checkThresholds(kpis){
  const cfg = getThresholds();
  const last = JSON.parse(localStorage.getItem('kpiLastMail')||'{}');
  const now = Date.now();
  kpis.forEach(k => {
    const th = cfg[k.label];
    const el = document.querySelector(`.kpi[data-kpi="${k.label}"]`);
    el?.classList.remove('alert-warn','alert-crit');
    el?.removeAttribute('title');
    el?.querySelector('.kpi-alert-icon')?.remove();
    if(!th) return;
    const val = parseFloat(k.value);
    let hit=false;
    if(th.op==='<' && val < th.value) hit=true;
    if(th.op==='>' && val > th.value) hit=true;
    if(th.op==='=' && val === th.value) hit=true;
    if(hit){
      const icon = document.createElement('span');
      icon.className='kpi-alert-icon';
      icon.textContent = th.op==='<'?'🛑':'⚠️';
      icon.setAttribute('aria-label', th.op==='<'?'kritisch':'Warnung');
      el?.prepend(icon);
      el?.classList.add(th.op==='<'?'alert-crit':'alert-warn');
      el?.setAttribute('title', `${k.label}: ${k.value} ${th.op} ${th.value}`);
      if(!el?.dataset.notified){
        showMsg(`KPI ${k.label} ${th.op}${th.value}`, 'error');
        if(th.email && window.api?.sendMail && process.env.DEV_FLAG!=='true'){
          if(!last[k.label] || now-last[k.label]>600000){
            window.api.sendMail({subject:`KPI ${k.label}`, text:`${k.label}: ${k.value}`}).catch(()=>{});
            last[k.label]=now;
            localStorage.setItem('kpiLastMail', JSON.stringify(last));
          }
        }
        if(el) el.dataset.notified='1';
      }
    }else if(el){
      delete el.dataset.notified;
    }
  });
}

function computeKpis(){
  const data = getData();
  const totalUmsatz = data.reduce((sum,r)=>sum+(parseFloat(r.Umsatz)||0),0);
  const totalPipeline = data.reduce((sum,r)=>sum+(parseFloat(r.Pipeline)||0),0);
  return [
    {label:'Umsatz', value: totalUmsatz.toFixed(0)},
    {label:'Pipeline', value: totalPipeline.toFixed(0)},
    {label:'Partner', value: new Set(data.map(r=>r.Partnername)).size},
    {label:'Systeme', value: new Set(data.map(r=>r.Systemname)).size},
    {label:'Laufende Verträge', value: data.filter(r=>String(r.Vertragsstatus||'').toLowerCase().includes('lauf')).length},
    {label:'Abgeschl. Trainings', value: data.filter(r=>String(r.Trainingsstatus||'').toLowerCase().includes('abgeschlossen')).length},
    {label:'DevPortal aktiv', value: data.filter(r=>String(r.Developer_Portal_Zugang||'').toLowerCase()==='ja').length}
  ];
}

export function renderKPIs(_version){
  const kpis = computeKpis();
  const box = document.getElementById('kpiBoxes');
  box.innerHTML = kpis.map(k=>`<div class="kpi" data-kpi="${k.label}"><button class="kpi-cfg" aria-label="Schwellwert anpassen">⚙️</button><div style="font-size:2rem;font-weight:bold">${k.value}</div><div>${k.label}</div></div>`).join('');
  box.querySelectorAll('.kpi-cfg').forEach(btn=>{
    btn.onclick = async e => { e.stopPropagation(); const mod = await import('./thresholdModal.js'); mod.openThresholdModal(btn.parentElement.dataset.kpi); };
  });
  checkThresholds(kpis);
  renderStatusChart();
}

function renderStatusChart(){
  const b = getStatusBuckets(getData());
  const ctx = document.getElementById('barStatus').getContext('2d');
  charts.barStatus?.destroy();
  charts.barStatus = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Partner'],
      datasets: [
        { label: 'aktiv', data: [b.aktiv], stack: 's', background: '#6ab8ff' },
        { label: 'teilaktiv', data: [b.teilaktiv], stack: 's', background: '#f59ac1' },
        { label: 'geplant', data: [b.geplant], stack: 's', background: '#ffce91' },
        { label: 'unbekannt', data: [b.unbekannt], stack: 's', background: '#ffe9b3' }
      ]
    },
    options: {
      responsive: true,
      aspectRatio: 8,
      indexAxis: 'y',
      plugins: { legend: { position: 'bottom' } },
      scales: { x: { stacked: true }, y: { stacked: true } }
    }
  });
}


export function showAlertsOverview(){
  const modal = createModal('Aktive Alerts');
  const cfg = getThresholds();
  const table = document.createElement('table');
  table.className = 'log-table';
  table.innerHTML = '<thead><tr><th>KPI</th><th>Op</th><th>Wert</th><th>Email</th><th></th></tr></thead><tbody></tbody>';
  Object.keys(cfg).forEach(k=>{
    const tr = document.createElement('tr');
    const row = cfg[k];
    tr.innerHTML = `<td>${k}</td><td>${row.op}</td><td>${row.value}</td><td><input type="checkbox" data-k="${k}" ${row.email?'checked':''} aria-label="E-Mail senden"></td><td><button data-k="${k}" aria-label="Löschen">🗑</button></td>`;
    table.querySelector('tbody').appendChild(tr);
  });
  modal.body.appendChild(table);
  modal.actions.innerHTML = `<button class="export-btn" id="alertsClose" style="background:#777;">Schließen</button>`;
  modal.actions.querySelector('#alertsClose').onclick = modal.close;
  table.querySelectorAll('input[type=checkbox]').forEach(cb=>{
    cb.onchange = () => { cfg[cb.dataset.k].email = cb.checked; thresholdStore(cfg); };
  });
  table.querySelectorAll('button').forEach(btn=>{
    btn.onclick = () => { delete cfg[btn.dataset.k]; thresholdStore(cfg); btn.closest('tr').remove(); };
  });
}

export { computeKpis };

