import { config } from 'dotenv';
config(); 

export default {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  setupFiles: ['<rootDir>/setupTests.js'], 
  testEnvironment: 'jest-environment-jsdom', 
};
