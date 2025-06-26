export const defaultFilterFields = [
  'Partnername', 'Systemname', 'Partnertyp',
  'Branche', 'Vertragsstatus', 'Vertragstyp'
];

export function getFilterFields(view, visible){
  return view === 'Alle' ? defaultFilterFields : visible;
}

export function buildPredicate(criteria = {}){
  const search = (criteria.search || '').toLowerCase();
  const fields = criteria.filters || {};
  return row => {
    if (search && !Object.values(row).some(v => String(v ?? '').toLowerCase().includes(search))) {
      return false;
    }
    for (const [key, val] of Object.entries(fields)) {
      if (val && !String(row[key] ?? '').toLowerCase().includes(String(val).toLowerCase())) {
        return false;
      }
    }
    return true;
  };
}

export function applyFilters(rows = [], criteria = {}){
  const pred = buildPredicate(criteria);
  return rows.filter(pred);
}
