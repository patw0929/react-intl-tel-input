import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import IntlTelInput from '../src/containers/IntlTelInputApp';
import TelInput from '../src/components/TelInput';
import { assert } from 'chai';

describe('TelInput', () => {
  let renderedComponent;
  let inputComponent;

  beforeEach('render element', () => {
    renderedComponent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        value={'0999 123 456'}
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

  it('Disabled nationalMode and input phone number', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        nationalMode={false}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886901234567' } });
    ReactTestUtils.Simulate.keyDown(findDOMNode(input), { key: 'Space' });
    assert(findDOMNode(input).value === '+886901234567');
  });

  it('change props value', () => {
    renderedComponent.componentWillReceiveProps({
      value: '0912345678',
    });
    assert(findDOMNode(inputComponent).value === '0912345678');
  });
});
