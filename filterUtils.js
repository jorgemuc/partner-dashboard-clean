const defaultFilterFields = [
  "Partnername","Systemname","Partnertyp",
  "Branche","Vertragsstatus","Vertragstyp"
];
function getFilterFields(view, visible){
  return view === 'Alle' ? defaultFilterFields : visible;
}
function getStatusBuckets(data){
  const counts={aktiv:0,teilaktiv:0,geplant:0,unbekannt:0};
  const seen=new Set();
  data.forEach(r=>{const n=r.Partnername;if(seen.has(n)) return;seen.add(n);const s=String(r.Vertragsstatus||'').toLowerCase();if(/lauf/.test(s)) counts.aktiv++;else if(/teil/.test(s)) counts.teilaktiv++;else if(/plan/.test(s)) counts.geplant++;else counts.unbekannt++;});
  return counts;
}
if(typeof module!=='undefined') module.exports={defaultFilterFields,getFilterFields,getStatusBuckets};
if(typeof window!=='undefined'){window.getFilterFields=getFilterFields;window.getStatusBuckets=getStatusBuckets;}
