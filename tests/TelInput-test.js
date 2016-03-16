import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import IntlTelInput from '../src/containers/IntlTelInputApp';
import TelInput from '../src/components/TelInput';
import { assert } from 'chai';

describe('TelInput', () => {
  let renderedComponent,
    inputElement;

  before('render element', function() {
    renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName={'telephone'}
          defaultValue={'0999 123 456'}
          utilsScript={'../example/assets/libphonenumber.js'}
        />
    );

    const inputComponent = ReactTestUtils.findRenderedDOMComponentWithTag(
      renderedComponent,
      'input'
    );

    inputElement = findDOMNode(inputComponent);
  });

  it('set fieldName as "telephone"', () => {
    const telInput = ReactTestUtils.findRenderedComponentWithType(renderedComponent, TelInput);
    assert(telInput.props.fieldName === 'telephone');
  });

  it('set value as "0999 123 456"', () => {
    const telInput = ReactTestUtils.findRenderedComponentWithType(renderedComponent, TelInput);
    assert(telInput.props.value === '0999 123 456');
  });

  it('set className', () => {
    const telInput = ReactTestUtils.findRenderedComponentWithType(renderedComponent, TelInput);
    assert(findDOMNode(telInput).className === 'form-control phoneNumber');
  });

  it('change value', () => {
    const telInput = ReactTestUtils.findRenderedComponentWithType(renderedComponent, TelInput);
    findDOMNode(telInput).value = '12345';
    ReactTestUtils.Simulate.change(findDOMNode(telInput));
    assert(telInput.props.value === '12345');
  });
});
