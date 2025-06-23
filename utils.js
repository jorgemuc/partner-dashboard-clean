function getStatusBuckets(rows){
  return rows.reduce((o,r)=>{
    const s = String(r.Vertragsstatus||'').toLowerCase();
    if(s.includes('teil'))      o.teilaktiv++;
    else if(s.includes('geplant')) o.geplant++;
    else if(s.includes('lauf')) o.aktiv++;
    else                        o.unbekannt++;
    return o;
  },{aktiv:0,teilaktiv:0,geplant:0,unbekannt:0});
}
module.exports = { getStatusBuckets };
