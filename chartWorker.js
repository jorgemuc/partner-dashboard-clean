onmessage = function(e) {
  const {canvasId, field, data} = e.data;
  const counts = {};
  data.forEach(r => {
    const k = r[field] || 'unbekannt';
    counts[k] = (counts[k] || 0) + 1;
  });
  postMessage({canvasId, labels:Object.keys(counts), values:Object.values(counts)});
};
