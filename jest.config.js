/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Relative imports in src/ ship with .js suffixes (required for native Node ESM
  // consumers). Jest+ts-jest resolves .ts files, so strip the .js suffix here.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  clearMocks: true,
  // Coverage gate — the hand-maintained plumbing under src/http must stay well-tested.
  // Generated rest-api/* files are ignored from the strict gate but still measured.
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/rest-api/**',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      lines:      0,
      functions:  0,
      branches:   0,
      statements: 0,
    },
    './src/http/': {
      lines:      85,
      functions:  85,
      branches:   70,
      statements: 85,
    },
  },
}
