export default {
  moduleNameMapper: {
    '\\.(css|png)$': 'identity-obj-proxy',
    '\\?raw$': '<rootDir>/tests/rawLoader.js'
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.afterEnv.js'],
  testEnvironmentOptions: { resources: 'usable' },
  testMatch: [
    '**/__tests__/*.test.js',
    '**/tests/eventBus.spec.js',
    '**/tests/lintNoBareImports.test.js'
  ]
};
