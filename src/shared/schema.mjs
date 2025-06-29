export const validationRules = {
  Partnername: { required: true },
  Vertragsbeginn: { pattern: /^\d{4}-\d{2}-\d{2}$/ },
  Vertragsende: { pattern: /^\d{4}-\d{2}-\d{2}$/ },
  Anzahl_Kunden: { min: 0 },
  Umsatz: { min: 0 },
  Pipeline: { min: 0 },
  ID: { readOnly: true }
};

export function validateCell(value, rule = {}) {
  if (rule.readOnly) return { valid: false, message: 'read-only' };
  if (rule.required && String(value).trim() === '') {
    return { valid: false, message: 'required' };
  }
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return { valid: false, message: 'format' };
  }
  if (typeof rule.min === 'number' && Number(value) < rule.min) {
    return { valid: false, message: `>=${rule.min}` };
  }
  if (typeof rule.max === 'number' && Number(value) > rule.max) {
    return { valid: false, message: `<=${rule.max}` };
  }
  return { valid: true };
}
