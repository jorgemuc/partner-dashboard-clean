function getStatusBuckets(rows){
  return {
    aktiv:      rows.filter(r=>/\baktiv\b/i.test(r.Vertragsstatus)).length,
    teilaktiv:  rows.filter(r=>/teilaktiv/i.test(r.Vertragsstatus)).length,
    geplant:    rows.filter(r=>/geplant/i.test(r.Vertragsstatus)).length,
    unbekannt:  rows.filter(r=>!/(aktiv|teilaktiv|geplant)/i.test(r.Vertragsstatus)).length
  };
}
module.exports = { getStatusBuckets };
