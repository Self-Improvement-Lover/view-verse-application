const karmaJasmine = require('karma-jasmine');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaVite = require('karma-vite');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: 'spec/**/*.test.tsx', type: 'module' },
      { pattern: '**/*.test.js', type: 'module' },
      { pattern: '**/*[sS]pec.?(m)js', type: 'module' },
      { pattern: '**/spec.?tsx', type: 'module' },
      { pattern: '**/*test.mjs', type: 'module' },
      { pattern: '**/*test.tsx', type: 'module' },
    ],
    preprocessors: {
      '**/*.ts': ['vite'], // Ensure TypeScript files are processed with Vite
      '**/*.tsx': ['vite'], // Ensure TSX files are processed with Vite
    },
    plugins: [
      karmaJasmine, // Jasmine adapter for Karma
      karmaChromeLauncher, // Launch Chrome browser for running tests
      karmaVite, // Vite preprocessor plugin
    ],
    browsers: ['Chrome'], // Runs tests in Chrome
    singleRun: true, // Set to `false` for development mode
    reporters: ['progress'], // Display test progress
    client: {
      jasmine: {
        random: false, // If you want to disable randomization of tests
      },
    },
  });
};
