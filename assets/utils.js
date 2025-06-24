export function getStatusBuckets(arr){
  const norm = s => (s || '').toLowerCase();
  return {
    aktiv:      arr.filter(r=>norm(r.Schnittstellenstatus).includes('aktiv') &&
                               !norm(r.Schnittstellenstatus).includes('teil')).length,
    teilaktiv:  arr.filter(r=>norm(r.Schnittstellenstatus).includes('teil')).length,
    geplant:    arr.filter(r=>norm(r.Schnittstellenstatus).includes('geplant')).length,
    unbekannt:  arr.filter(r=>!/(aktiv|teilaktiv|geplant)/i.test(norm(r.Schnittstellenstatus))).length
  };
}
