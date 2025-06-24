export function getStatusBuckets(arr){
  return {
    aktiv:      arr.filter(r=>/\baktiv\b/i.test(r.Vertragsstatus)).length,
    teilaktiv:  arr.filter(r=>/teilaktiv/i.test(r.Vertragsstatus)).length,
    geplant:    arr.filter(r=>/geplant/i.test(r.Vertragsstatus)).length,
    unbekannt:  arr.filter(r=>!/(aktiv|teilaktiv|geplant)/i.test(r.Vertragsstatus)).length
  };
}
