'use strict';

describe('ReactIntlTelInputApp', function () {
  var React = require('react/addons');
  var ReactIntlTelInputApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactIntlTelInputApp = require('components/ReactIntlTelInputApp.js');
    component = React.createElement(ReactIntlTelInputApp);
  });

  it('should create a new instance of ReactIntlTelInputApp', function () {
    expect(component).toBeDefined();
  });
});
