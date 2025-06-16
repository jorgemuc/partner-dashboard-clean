const { parseCsv } = require('../parser');

describe('parseCsv', () => {
  test('detects semicolon delimiter and normalizes empty fields', () => {
    const csv = '\uFEFFA;B;C\n1;2;\n3;;5';
    const result = parseCsv(csv);
    expect(result.delimiter).toBe(';');
    expect(result.data[1].B).toBe('');
  });

  test('applies header aliases and reports missing/unexpected columns', () => {
    const csv = 'partner_name,contract_start,Extra\nFoo,2024-01-01,1';
    const res = parseCsv(csv);
    expect(res.missing).toContain('Vertragsende');
    expect(res.unexpected).toContain('Extra');
    expect(res.data[0]['Vertragsbeginn']).toBe('2024-01-01');
  });
});
