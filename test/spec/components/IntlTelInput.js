'use strict';

describe('IntlTelInput', function () {
  var React = require('react/addons');
  var IntlTelInput, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    IntlTelInput = require('components/IntlTelInput.js');
    component = React.createElement(IntlTelInput);
  });

  it('should create a new instance of IntlTelInput', function () {
    expect(component).toBeDefined();
  });
});
