module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/__mocks__/**',
    '!**/__tests__/**',
    '!.storybook',
  ],
  setupFiles: ['<rootDir>/config/jest/setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/config/jest/setupTestFramework.js',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>[/\\\\](build|docs|node_modules)[/\\\\]'],
  testRegex: '/__tests__/.*\\.(test|spec)\\.js$',
  testURL: 'http://localhost',
  transform: {
    '^(?!.*\\.(js|jsx|css|scss|json)$)':
      '<rootDir>/config/jest/fileTransform.js',
    '^.+\\.(js|jsx)$': '<rootDir>/config/jest/transform.js',
    '^.+\\.(scss|css)$': '<rootDir>/config/jest/cssTransform.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
}
