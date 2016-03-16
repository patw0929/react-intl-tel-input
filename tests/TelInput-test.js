import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import IntlTelInput from '../src/containers/IntlTelInputApp';
import TelInput from '../src/components/TelInput';
import { assert } from 'chai';

describe('TelInput', () => {
  let inputComponent;

  before('render element', () => {
    const renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName={'telephone'}
          defaultValue={'0999 123 456'}
          utilsScript={'../example/assets/libphonenumber.js'}
        />
    );

    inputComponent = ReactTestUtils.findRenderedComponentWithType(
      renderedComponent,
      TelInput
    );
  });

  it('set fieldName as "telephone"', () => {
    assert(inputComponent.props.fieldName === 'telephone');
  });

  it('set value as "0999 123 456"', () => {
    assert(inputComponent.props.value === '0999 123 456');
  });

  it('set className', () => {
    assert(findDOMNode(inputComponent).className === 'form-control phoneNumber');
  });

  it('change value', () => {
    findDOMNode(inputComponent).value = '12345';
    ReactTestUtils.Simulate.change(findDOMNode(inputComponent));
    assert(inputComponent.props.value === '12345');
  });
});
