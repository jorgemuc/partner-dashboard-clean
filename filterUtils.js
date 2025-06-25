export const defaultFilterFields = [
  "Partnername","Systemname","Partnertyp",
  "Branche","Vertragsstatus","Vertragstyp"
];
export function getFilterFields(view, visible){
  return view === 'Alle' ? defaultFilterFields : visible;
}
