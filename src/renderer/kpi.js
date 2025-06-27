import { getData } from './dataStore.js';
import { getStatusBuckets } from './utils.js';
let charts = {};
export function setChartsRef(obj){ charts = obj; }

export function getThresholds(){
  return JSON.parse(localStorage.getItem('kpiThresholds')||'{}');
}

export function checkThresholds(kpis){
  const cfg = getThresholds();
  const last = JSON.parse(localStorage.getItem('kpiLastMail')||'{}');
  const now = Date.now();
  kpis.forEach(k => {
    const th = cfg[k.label];
    const el = document.querySelector(`.kpi[data-kpi="${k.label}"]`);
    el?.classList.remove('alert');
    if(!th) return;
    const val = parseFloat(k.value);
    let hit=false;
    if(th.op==='<' && val < th.value) hit=true;
    if(th.op==='>' && val > th.value) hit=true;
    if(th.op==='=' && val === th.value) hit=true;
    if(hit){
      el?.classList.add('alert');
      if(!el?.dataset.notified){
        window.showMsg?.(`KPI ${k.label} ${th.op}${th.value}`, 'error');
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
  box.innerHTML = kpis.map(k=>`<div class="kpi" data-kpi="${k.label}"><div style="font-size:2rem;font-weight:bold">${k.value}</div><div>${k.label}</div></div>`).join('');
  box.querySelectorAll('.kpi').forEach(div=>{
    div.ondblclick = () => configureThreshold(div.dataset.kpi);
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

function configureThreshold(label){
  const current = getThresholds()[label] || { op:'<', value:0, email:false };
  const input = prompt(`${label} Threshold (<n | >n | =n)`, `${current.op}${current.value}`);
  if(!input){
    const t = getThresholds();
    delete t[label];
    localStorage.setItem('kpiThresholds', JSON.stringify(t));
    checkThresholds(computeKpis());
    return;
  }
  const m = input.match(/([<>]=?|=)\s*(\d+(?:\.\d+)?)/);
  if(!m) return;
  const email = confirm('E-Mail schicken?');
  const t = getThresholds();
  t[label] = { op:m[1], value:parseFloat(m[2]), email };
  localStorage.setItem('kpiThresholds', JSON.stringify(t));
  checkThresholds(computeKpis());
}

export { configureThreshold };

