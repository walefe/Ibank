import config from './jest.shared';

export default {
  ...config,
  rootDir: '..',
  testMatch: ['<rootDir>/src/obligations/__test__/e2e/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'], // Optional: separate e2e setup
  testTimeout: 30000, // Longer timeout for e2e tests
};
