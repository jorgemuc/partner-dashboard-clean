const { getFilterFields, defaultFilterFields } = require('../filterUtils.js');

describe('getFilterFields',()=>{
  test('returns defaults for Alle',()=>{
    expect(getFilterFields('Alle',['A'])).toEqual(defaultFilterFields);
  });
  test('returns visible for others',()=>{
    expect(getFilterFields('Tech',['X','Y'])).toEqual(['X','Y']);
  });
});
