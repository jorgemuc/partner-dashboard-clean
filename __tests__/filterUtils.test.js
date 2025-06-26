const { test, expect, describe } = require('@jest/globals');
let getFilterFields, defaultFilterFields;

describe('getFilterFields', () => {
  beforeAll(async () => {
    ({ getFilterFields, defaultFilterFields } = await import('../src/shared/filterUtils.mjs'));
  });
  test('returns defaults for "Alle"', () => {
    expect(getFilterFields('Alle', ['A'])).toEqual(defaultFilterFields);
  });

  test('returns visible for others', () => {
    expect(getFilterFields('Tech', ['X', 'Y'])).toEqual(['X', 'Y']);
  });
});
