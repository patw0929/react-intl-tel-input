/* global jasmine:false */

if (process.env.CI) {
  const jasmineReporters = require('jasmine-reporters'); // eslint-disable-line global-require
  const junitReporter = new jasmineReporters.JUnitXmlReporter({
    savePath: 'testresults',
    consolidateAll: false,
  });

  jasmine.getEnv().addReporter(junitReporter);
}

