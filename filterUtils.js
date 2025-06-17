const defaultFilterFields = [
  "Partnername","Systemname","Partnertyp",
  "Branche","Vertragsstatus","Vertragstyp"
];
function getFilterFields(view, visible){
  return view === 'Alle' ? defaultFilterFields : visible;
}
if(typeof module!=='undefined') module.exports={defaultFilterFields,getFilterFields};
if(typeof window!=='undefined') window.getFilterFields=getFilterFields;
