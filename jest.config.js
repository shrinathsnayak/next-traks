/** @type {import('jest').Config} */
const config = {
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testTimeout: 60000,
}

module.exports = config
