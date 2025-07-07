const path = require('path');

test('parser module resolves', () => {
  const target = path.join(process.cwd(), 'src/utils/parser.js');
  expect(() => require.resolve(target)).not.toThrow();
});
