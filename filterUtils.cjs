const defaultFilterFields = [
  "Partnername","Systemname","Partnertyp",
  "Branche","Vertragsstatus","Vertragstyp"
];
function getFilterFields(view, visible){
  return view === 'Alle' ? defaultFilterFields : visible;
}
module.exports = { defaultFilterFields, getFilterFields };
if (typeof window !== 'undefined'){
  window.filterUtils = { defaultFilterFields, getFilterFields };
}
