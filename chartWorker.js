/**
 * Aggregate label counts for charts.
 * @param {string} field - Property to count.
 * @param {Array<Object>} data - Partner rows.
 * @returns {{labels:string[], values:number[]}}
 */
export function buildChart(field, rows){
  if(!Array.isArray(rows) || rows.length===0){
    return { labels:[], values:[] };
  }
  const counts = {};
  rows.forEach(r => {
    const k = r[field] || 'unbekannt';
    counts[k] = (counts[k] || 0) + 1;
  });
  return { labels: Object.keys(counts), values: Object.values(counts) };
}

let bus;
try {
  ({ default: bus } = await import('../src/renderer/eventBus.js'));
} catch (e) {
  self.postMessage({ error: 'eventBus import failed – see README#troubleshooting' });
}

self.onmessage = ({data}) => {
  if(!data || !data.rows){
    postMessage({ type:'chart-empty' });
    return;
  }
  const {id, field, rows} = data;
  const { labels, values } = buildChart(field, rows);
  postMessage({id, labels, values});
};
