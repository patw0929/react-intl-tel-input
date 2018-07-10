var path = require('path');

module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  presets: [
    // Latest stable ECMAScript features
    ['env', { es2015: { 'modules': false } }],
    // JSX, Flow
    require.resolve('babel-preset-react')
  ],
  plugins: [
    // class { handleClick = () => { } }
    require.resolve('babel-plugin-transform-class-properties'),
    // { ...todo, completed: true }
    require.resolve('babel-plugin-transform-object-rest-spread'),
    // function* () { yield 42; yield 43; }
    [require.resolve('babel-plugin-transform-regenerator'), {
      // Async functions are converted to generators by babel-preset-latest
      async: false
    }],
    // Polyfills the runtime needed for async/await and generators
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      // Resolve the Babel runtime relative to the config.
      // You can safely remove this after ejecting:
      moduleName: path.dirname(require.resolve('babel-runtime/package'))
    }],
    // Get rid of proptypes in dist.
    require.resolve('babel-plugin-transform-react-remove-prop-types'),
    // Optimization: hoist JSX that never changes out of render()
    // Disabled because of issues:
    // * https://github.com/facebookincubator/create-react-app/issues/525
    // * https://phabricator.babeljs.io/search/query/pCNlnC2xzwzx/
    // TODO: Enable again when these issues are resolved.
    // require.resolve('babel-plugin-transform-react-constant-elements')
    // to enable import() [dynamic import]
    require.resolve('babel-plugin-syntax-dynamic-import'),
  ]
};
