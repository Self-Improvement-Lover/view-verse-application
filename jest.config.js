// maybe should delete this and just export default normal object

import { config } from 'dotenv';
config(); // Load environment variables

export default {
 transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
 preset: 'ts-jest/presets/js-with-ts-esm', // Use ESM-compatible preset
  setupFiles: ['<rootDir>/setupTests.js'], // Your setup file for environment variables
  testEnvironment: 'jest-environment-jsdom', // or 'jsdom', depending on your requirements
};
