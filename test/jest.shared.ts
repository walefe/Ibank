export default {
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  setupFiles: ['<rootDir>/test/setup.ts'],
  verbose: true,
  resetMocks: true,
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.e2e-spec.ts',
    '!src/main.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/unit',
  coverageReporters: ['text', 'lcov', 'html'],
};
