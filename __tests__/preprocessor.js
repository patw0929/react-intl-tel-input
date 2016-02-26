const babelJest = require('babel-jest');
const webpackAlias = require('jest-webpack-alias');

module.exports = {
  process(src, filename) {
    if (filename.match(/\.[css|less|scss]/)) {
      return '';
    }
    if (filename.indexOf('node_modules') === -1) {
      src = babelJest.process(src, filename);
      src = webpackAlias.process(src, filename);
    }
    return src;
  },
};
