import '../.auto_mock_off';
import React, { findDOMNode } from 'react/addons';
import IntlTelInput from '../src/containers/App';
import TelInput from '../src/components/TelInput';

describe('TelInput', () => {
  var TestUtils = React.addons.TestUtils;
  var component;

  beforeEach(() => {
    component = TestUtils.renderIntoDocument(
        <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
                      fieldName={'telephone'}
                      defaultValue={'0999 123 456'}
                      utilsScript={'../example/assets/libphonenumber.js'} />
    );
  });

  it('set fieldName as "telephone"', () => {
    let telInput = TestUtils.findRenderedComponentWithType(component, TelInput);
    expect(telInput.props.fieldName).toEqual('telephone');
  });

  it('set value as "0999 123 456"', () => {
    let telInput = TestUtils.findRenderedComponentWithType(component, TelInput);
    expect(telInput.props.value).toEqual('0999 123 456');
  });

  it('set className', function() {
    let telInput = TestUtils.findRenderedComponentWithType(component, TelInput);
    expect(findDOMNode(telInput).className).toEqual('form-control phoneNumber');
  });

  it('change value', function() {
    let telInput = TestUtils.findRenderedComponentWithType(component, TelInput);
    findDOMNode(telInput).value = '12345';
    TestUtils.Simulate.change(findDOMNode(telInput));
    expect(telInput.props.value).toEqual('12345');
  });
});
