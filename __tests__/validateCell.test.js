let validateCell;
beforeAll(async () => {
  ({ validateCell } = await import('../src/shared/schema.mjs'));
});

test('required rule', () => {
  expect(validateCell('', { required: true }).valid).toBe(false);
  expect(validateCell('x', { required: true }).valid).toBe(true);
});

test('pattern rule', () => {
  const r = { pattern: /^\d{4}-\d{2}-\d{2}$/ };
  expect(validateCell('2024-01-01', r).valid).toBe(true);
  expect(validateCell('1/1/2024', r).valid).toBe(false);
});

test('min rule', () => {
  expect(validateCell('5', { min: 3 }).valid).toBe(true);
  expect(validateCell('1', { min: 3 }).valid).toBe(false);
});
