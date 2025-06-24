/**
 * Aggregate label counts for charts.
 * @param {string} field - Property to count.
 * @param {Array<Object>} data - Partner rows.
 * @returns {{labels:string[], values:number[]}}
 */
export function buildChart(field, data){
  const counts = {};
  data.forEach(r => {
    const k = r[field] || 'unbekannt';
    counts[k] = (counts[k] || 0) + 1;
  });
  return { labels: Object.keys(counts), values: Object.values(counts) };
}

onmessage = function(e) {
  const {canvasId, field, data} = e.data;
  const { labels, values } = buildChart(field, data);
  postMessage({canvasId, labels, values});
};
