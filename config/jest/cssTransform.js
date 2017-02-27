// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

module.exports = {
  process() {
    return `
      const idObj = require('identity-obj-proxy');
      module.exports = idObj;
    `;
  },
  getCacheKey(fileData, filename) { // eslint-disable-line no-unused-vars
    // The output is always the same.
    return 'cssTransform';
  },
};
