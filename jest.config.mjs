export default {
  moduleNameMapper: {
    '\\.(css|png)$': 'identity-obj-proxy',
    '\\?raw$': '<rootDir>/tests/rawLoader.js'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testEnvironmentOptions: { resources: 'usable' },
  testMatch: [
    '**/__tests__/*.test.js',
    '**/tests/eventBus.spec.js',
    '**/tests/lintNoBareImports.test.js'
  ]
};
