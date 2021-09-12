module.exports = {
  extends: ['eslint-config-airbnb', 'plugin:prettier/recommended'],
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
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
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
  overrides: [
    // typescript common config
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      files: ['**/*.d.ts', '**/*.test.ts', '**/*.test.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint',
        'eslint-plugin-import',
        'eslint-plugin-react',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'import/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
            },
            groups: [['external', 'builtin'], 'parent', 'sibling'],
            'newlines-between': 'always',
          },
        ],
        'react/jsx-first-prop-new-line': [1, 'multiline'],
        'react/jsx-max-props-per-line': [
          1,
          {
            maximum: 1,
          },
        ],
        'react/sort-comp': [
          2,
          {
            order: [
              'static-methods',
              'instance-variables',
              'instance-methods',
              'lifecycle',
              'everything-else',
              'render',
            ],
          },
        ],
        'spaced-comment': [
          'error',
          'always',
          {
            line: {
              markers: ['#region', '#endregion', 'region', 'endregion'],
            },
          },
        ],
      },
      settings: {
        'import/resolver': 'eslint-import-resolver-typescript',
      },
    },
    // typescript test-only config
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'no-use-before-define': 'off',
        'no-console': 'off', // we want to be able to output results for tsc purposes
      },
    },
  ],
}
