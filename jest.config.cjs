module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
};
