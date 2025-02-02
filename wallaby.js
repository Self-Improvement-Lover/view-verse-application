export default function () {
  return {
    files: [
      'src/*/.js',
      'src/*/.tsx',
      'src/*/*/.tsx', // Source files
    ],
    tests: [
      'test/*/.spec.js',
      'spec/*/.test.tsx', // Test files
    ],
    env: {
      kind: 'chrome', // Runs tests in a browser environment (via Karma)
    },
    testFramework: 'jasmine',
  };
}
