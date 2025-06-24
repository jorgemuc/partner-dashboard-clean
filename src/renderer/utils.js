export function getStatusBuckets(rows){
  const norm = s => (s || '').toLowerCase();
  return {
    aktiv:       rows.filter(r => norm(r.Schnittstellenstatus).includes('aktiv') &&
                                  !norm(r.Schnittstellenstatus).includes('teil')).length,
    teilaktiv:   rows.filter(r => norm(r.Schnittstellenstatus).includes('teil')).length,
    geplant:     rows.filter(r => norm(r.Schnittstellenstatus).includes('geplant')).length,
    unbekannt:   rows.filter(r => !/(aktiv|teilaktiv|geplant)/i.test(norm(r.Schnittstellenstatus))).length
  };
}
