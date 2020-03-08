module.exports = {
    extends: ['eslint-config-airbnb', "plugin:prettier/recommended"],
  plugins: ['react', 'import', 'security', 'prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'prefer-destructuring': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-no-bind': 'error',
    'react/no-multi-comp': 'off',
    'no-restricted-syntax': [
      'error',
      'DebuggerStatement',
      'ForInStatement',
      'WithStatement',
    ],
    'comma-dangle': ['error', 'always-multiline'], // https://github.com/airbnb/javascript/commit/788208295469e19b806c06e01095dc8ba1b6cdc9
    'no-underscore-dangle': 'off',
    'react/require-default-props': 'off',
    'react/jsx-curly-spacing': 'off',
    'arrow-body-style': 'off',
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/no-string-refs': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'import/no-unresolved': [
      2,
      { ignore: ['react', 'react-dom', 'react-intl-tel-input'] },
    ],
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'test/**', // tape, common npm pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          '**/__mocks__/**', // jest pattern
          'test.js', // repos with a single test file
          'test-*.js', // repos with multiple top-level test files
          '**/*.test.js', // tests where the extension denotes that it is a test
          '**/webpack.config.js', // webpack config
          '**/webpack.config.*.js', // webpack config
          'config/jest/**',
          'src/testUtils/**',
          '*.js',
        ],
        optionalDependencies: false,
      },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
  
  globals: {
    __DEVELOPMENT__: true,
    __CLIENT__: true,
    __SERVER__: true,
    __DISABLE_SSR__: true,
    __DEVTOOLS__: true,
  },
};
