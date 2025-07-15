/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          jsxImportSource: '@systembug/wsx-core',
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          isolatedModules: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleNameMapping: {
    '^@systembug/wsx-core$': '<rootDir>/packages/core/src',
    '^@systembug/wsx-vite-plugin$': '<rootDir>/packages/vite-plugin/src',
    '^@systembug/wsx-eslint-plugin$': '<rootDir>/packages/eslint-plugin/src',
    '^@systembug/wsx-components$': '<rootDir>/packages/components/src',
    '\\.css\\?inline$': '<rootDir>/test/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/*.test.{ts,tsx}',
    '!packages/*/src/**/__tests__/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
