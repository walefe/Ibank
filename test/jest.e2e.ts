import config from './jest.shared';

export default {
  ...config,
  testMatch: ['<rootDir>/src/__test__/e2e/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.e2e.ts'], // Optional: separate e2e setup
  testTimeout: 30000, // Longer timeout for e2e tests
};
