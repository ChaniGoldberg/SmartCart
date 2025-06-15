const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

if (tsJestTransformCfg['^.+\\.(ts|tsx)$']) {
  if (Array.isArray(tsJestTransformCfg['^.+\\.(ts|tsx)$'])) {
    tsJestTransformCfg['^.+\\.(ts|tsx)$'][1] = {
      ...(tsJestTransformCfg['^.+\\.(ts|tsx)$'][1] || {}),
      useESM: false,
    };
  } else {
    tsJestTransformCfg['^.+\\.(ts|tsx)$'] = [
      tsJestTransformCfg['^.+\\.(ts|tsx)$'],
      { useESM: false },
    ];
  }
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: tsJestTransformCfg,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/scripts'],
};