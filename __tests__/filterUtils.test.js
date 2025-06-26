const { test, expect, describe } = require('@jest/globals');

describe('applyFilters', () => {
  test('filters by column', async () => {
    const { applyFilters } = await import('../src/shared/filterUtils.mjs');
    const rows = [{ Name: 'A' }, { Name: 'B' }];
    const res = applyFilters(rows, { filters: { Name: 'B' } });
    expect(res).toEqual([{ Name: 'B' }]);
  });

  test('applies search', async () => {
    const { applyFilters } = await import('../src/shared/filterUtils.mjs');
    const rows = [{ Name: 'Alpha' }, { Name: 'Beta' }];
    const res = applyFilters(rows, { search: 'bet' });
    expect(res).toEqual([{ Name: 'Beta' }]);
  });
});
