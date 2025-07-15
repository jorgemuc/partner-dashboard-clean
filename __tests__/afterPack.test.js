const afterPack = require('../builder.afterPack.js');
const asar = require('@electron/asar');
const fs = require('node:fs/promises');

jest.mock('@electron/asar');
jest.mock('node:fs/promises');

beforeEach(() => {
  fs.access.mockResolvedValue();
});

test('accepts root level preload path', async () => {
  asar.listPackage.mockReturnValue(['preload.js']);
  await expect(afterPack({ appOutDir: '.' })).resolves.toBeUndefined();
});

test('fails when preload missing', async () => {
  asar.listPackage.mockReturnValue(['index.js']);
  await expect(afterPack({ appOutDir: '.' })).rejects.toThrow('preload.js missing');
});
