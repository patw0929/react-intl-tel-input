module.exports = {  
  "collectCoverageFrom": [
    "src/**/*.js",
    "!**/__mocks__/**",
    "!**/__tests__/**",
    "!.storybook",
  ],
  "setupFiles": [
    "<rootDir>/config/jest/setup.js",
  ],
  "setupTestFrameworkScriptFile": "<rootDir>/config/jest/setupTestFramework.js",
  "testPathIgnorePatterns": [
    "<rootDir>[/\\\\](build|docs|node_modules)[/\\\\]",
  ],
  "testEnvironment": "jsdom",
  "testURL": "http://localhost",
  "transform": {
    "^.+\\.(js|jsx)$": "<rootDir>/config/jest/transform.js",
    "^.+\\.(scss|css)$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|css|scss|json)$)": "<rootDir>/config/jest/fileTransform.js",
  },
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$",
  ],
  "testRegex": "/__tests__/.*\\.(test|spec)\\.js$",
}
