const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;
/** @type {import("jest").Config} **/
module.exports = {
 preset: 'ts-jest',
 testEnvironment: 'node',
 moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/scripts'],
  globals: {
    'ts-jest': {
      useESM: false,
    },
  },
};
