const {getFilterFields,defaultFilterFields}=require('../filterUtils');

describe('getFilterFields',()=>{
  test('returns defaults for Alle',()=>{
    expect(getFilterFields('Alle',['A'])).toEqual(defaultFilterFields);
  });
  test('returns visible for others',()=>{
    expect(getFilterFields('Tech',['X','Y'])).toEqual(['X','Y']);
  });
});
