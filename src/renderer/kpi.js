import { getData } from './dataStore.js';
import { getStatusBuckets } from './utils.js';
let charts = {};
export function setChartsRef(obj){ charts = obj; }

export function renderKPIs(version){
  const data = getData();
  const totalUmsatz = data.reduce((sum,r)=>sum+(parseFloat(r.Umsatz)||0),0);
  const totalPipeline = data.reduce((sum,r)=>sum+(parseFloat(r.Pipeline)||0),0);
  const kpis=[
    {label:'Umsatz', value: totalUmsatz.toFixed(0)},
    {label:'Pipeline', value: totalPipeline.toFixed(0)},
    {label:'Partner', value: new Set(data.map(r=>r.Partnername)).size},
    {label:'Systeme', value: new Set(data.map(r=>r.Systemname)).size},
    {label:'Laufende Verträge', value: data.filter(r=>String(r.Vertragsstatus||'').toLowerCase().includes('lauf')).length},
    {label:'Abgeschl. Trainings', value: data.filter(r=>String(r.Trainingsstatus||'').toLowerCase().includes('abgeschlossen')).length},
    {label:'DevPortal aktiv', value: data.filter(r=>String(r.Developer_Portal_Zugang||'').toLowerCase()==='ja').length}
  ];
  document.getElementById('kpiBoxes').innerHTML = kpis.map(k=>`<div class="kpi"><div style="font-size:2rem;font-weight:bold">${k.value}</div><div>${k.label}</div></div>`).join('');
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
