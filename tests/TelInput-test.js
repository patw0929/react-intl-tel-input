/* eslint-disable no-eval */
import React from 'react';
import { findDOMNode, render } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import IntlTelInput from '../src/containers/IntlTelInputApp';
import TelInput from '../src/components/TelInput';
import sinon from 'sinon';
import fs from 'fs';
import { assert } from 'chai';

describe('TelInput', () => {
  let renderedComponent;
  let inputComponent;
  let libphonenumberUtils;
  let xhr;
  let requests;
  let getScript;

  beforeEach('Render element', () => {
    libphonenumberUtils = fs.readFileSync('./example/assets/libphonenumber.js', 'utf8');
    xhr = sinon.useFakeXMLHttpRequest();
    window.intlTelInputUtils = undefined;
    requests = [];
    xhr.onCreate = (x) => {
      requests.push(x);
    };

    getScript = () =>
      document.getElementsByTagName('script')[0];

    renderedComponent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        fieldId={'telephone-id'}
        defaultCountry={'tw'}
        value={'0999 123 456'}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    inputComponent = ReactTestUtils.findRenderedComponentWithType(
      renderedComponent,
      TelInput
    );
  });

  afterEach('Unmount component', () => {
    xhr.restore();
  });

  it('Set fieldName as "telephone"', () => {
    assert(inputComponent.props.fieldName === 'telephone');
  });

  it('Set fieldId as "telephone-id"', () => {
    assert(inputComponent.props.fieldId === 'telephone-id');
  });

  it('onPhoneNumberChange without utilsScript', () => {
    let expected = '';
    const onPhoneNumberChange = (isValid, newNumber, countryData, fullNumber, ext) => {
      expected = `${isValid},${newNumber},${countryData.iso2},${fullNumber},${ext}`;
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        onPhoneNumberChange={onPhoneNumberChange}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886911222333' } });
    assert(expected === 'false,+886911222333,tw,+886911222333,');
  });

  it('Set value as "0999 123 456"', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    assert(inputComponent.props.value === '0999 123 456');
  });

  it('Set className', () => {
    assert(findDOMNode(inputComponent).className === 'form-control phoneNumber');
  });

  it('Change value', () => {
    findDOMNode(inputComponent).value = '12345';
    ReactTestUtils.Simulate.change(findDOMNode(inputComponent));
    assert(inputComponent.props.value === '12345');
  });


  it('Not focused on render', () => {
    const initialSelectFlag = IntlTelInput.prototype.selectFlag;

    let focused = false;

    IntlTelInput.prototype.selectFlag = function selectFlag(countryCode, setFocus = true) {
      focused = focused || setFocus;
      initialSelectFlag.call(this, countryCode, setFocus);
    };

    ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        value="+886901234567"
        preferredCountries={['kr', 'jp', 'tw']}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    IntlTelInput.prototype.selectFlag = initialSelectFlag;
    assert(!focused, 'the input should not have been focused');
  });


  it('Preferred countries', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'zz'}
        preferredCountries={['kr', 'jp', 'tw']}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    assert(parent.state.countryCode === 'kr');
  });

  it('Invalid default country', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        preferredCountries={[]}
        defaultCountry={'zz'}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    assert(parent.state.countryCode === 'af');
  });

  it('getNumber without utilsScript', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
      />
    );

    assert(parent.getNumber(1) === '');
  });

  it('setNumber', () => {
    renderedComponent.setNumber('+810258310015');
    assert(renderedComponent.state.countryCode === 'jp');
  });

  it('handleKeyUp', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    const len = findDOMNode(inputComponent).value.length;
    findDOMNode(inputComponent).focus();
    findDOMNode(inputComponent).setSelectionRange(len, len);
    ReactTestUtils.Simulate.keyUp(findDOMNode(inputComponent), {
      key: 'Backspace',
      keyCode: 8,
      which: 8,
    });
    ReactTestUtils.Simulate.change(findDOMNode(inputComponent), {
      target: { value: '0999 123 45' },
    });
    assert(findDOMNode(inputComponent).value === '0999 123 45');
  });

  it('ensurePlus', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        nationalMode={false}
        defaultCountry={'tw'}
        value={'+886999111222345'}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    const len = findDOMNode(input).value.length;
    findDOMNode(input).focus();
    findDOMNode(input).setSelectionRange(len, len);
    const bspaceKey = {
      key: 'Backspace',
      keyCode: 8,
      which: 8,
    };
    ReactTestUtils.Simulate.keyUp(findDOMNode(input), bspaceKey);
    ReactTestUtils.Simulate.keyUp(findDOMNode(input), bspaceKey);
    ReactTestUtils.Simulate.keyUp(findDOMNode(input), bspaceKey);
    ReactTestUtils.Simulate.change(findDOMNode(input), {
      target: { value: '+886 999 111 222' },
    });
    assert(parent.state.value === '+886 999 111 222');
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
    assert(findDOMNode(input).value === '+886901234567');
  });

  it('Change props value', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    renderedComponent.setState({
      value: '+886912345678',
    });
    assert(findDOMNode(inputComponent).value === '+886912345678');
  });

  it('utils loaded', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    assert(typeof window.intlTelInputUtils === 'object');
    assert(typeof window.intlTelInputUtils.isValidNumber === 'function');
  });

  it('onPhoneNumberChange', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    let expected = '';
    const onPhoneNumberChange = (isValid, newNumber, countryData, fullNumber, ext) => {
      expected = `${isValid},${newNumber},${countryData.iso2},${fullNumber},${ext}`;
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
        onPhoneNumberChange={onPhoneNumberChange}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886911222333' } });
    assert(expected === 'true,+886911222333,tw,+886 911 222 333,null');
  });

  it('Blur and cleaning the empty dialcode', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886' } });
    parent.handleOnBlur();
    assert(parent.state.value === '');
  });

  it('onPhoneNumberBlur', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    let expected = '';
    const onPhoneNumberBlur = (isValid, newNumber, countryData, fullNumber, ext) => {
      expected = `${isValid},${newNumber},${countryData.iso2},${fullNumber},${ext}`;
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
        onPhoneNumberBlur={onPhoneNumberBlur}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886911222333' } });
    ReactTestUtils.Simulate.blur(findDOMNode(input));
    assert(expected === 'true,+886911222333,tw,+886 911 222 333,null');
  });

  it('has empty value and not nationalMode, not autoHideDialCode and not separateDialCode', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        nationalMode={false}
        autoHideDialCode={false}
        separateDialCode={false}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    assert(parent.state.value === '+886');
  });

  it('updateFlagFromNumber', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'us'}
        utilsScript={'../example/assets/libphonenumber.js'}
        nationalMode
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '9183319436' } });
    assert(parent.state.countryCode === 'us');

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+' } });
    assert(parent.state.countryCode === 'us');
  });

  it('isValidNumber', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    assert(renderedComponent.isValidNumber('0910123456') === true);
    assert(renderedComponent.isValidNumber('091012345') === false);
  });

  it('getFullNumber', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
        separateDialCode
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '910123456' } });
    assert(parent.getFullNumber() === '+886910123456');
  });

  it('should change input value on value prop change', () => {
    const node = document.createElement('div');
    const component = render(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        value={'0999 123 456'}
      />
    , node);

    render(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        value={'foo bar'}
      />
    , node);

    inputComponent = ReactTestUtils.findRenderedComponentWithType(
      component,
      TelInput
    );

    assert.equal(inputComponent.props.value, 'foo bar');
  });

  it('should render custom placeholder', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);
    window.eval(getScript().text);

    const node = document.createElement('div');
    const component = render(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        utilsScript={'../example/assets/libphonenumber.js'}
        placeholder={'foo'}
        customPlaceholder={() => 'bar'}
      />
    , node);

    const input = ReactTestUtils.findRenderedComponentWithType(
      component,
      TelInput
    );

    assert.equal(input.props.placeholder, 'foo');
  });

  it('should focus input when autoFocus set to true', () => {
    const node = document.createElement('div');
    const component = render(
      <IntlTelInput
        css={['intl-tel-input', 'foo']}
        autoFocus
      />
    , node);

    const input = ReactTestUtils.findRenderedDOMComponentWithClass(
      component,
      'foo'
    );

    const inputDOMNode = findDOMNode(input);

    assert.equal(document.activeElement, inputDOMNode);
  });

  it('should not focus input when autoFocus set to false', () => {
    const node = document.createElement('div');
    const component = render(
      <IntlTelInput css={['intl-tel-input', 'foo']} />
    , node);

    const input = ReactTestUtils.findRenderedDOMComponentWithClass(
      component,
      'foo'
    );

    const inputDOMNode = findDOMNode(input);

    assert.notEqual(document.activeElement, inputDOMNode);
  });

  it('defaults to a plain input if a renderer is not specified', () => {
    assert.equal(inputComponent._reactInternalInstance._renderedComponent._tag, 'input');
  });

  it('allows the user to pass in an alternate renderer', () => {
    const renderedComponent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        inputRenderer={( props ) => React.createElement('textarea', props)}
      />
    );

    const inputComponent = ReactTestUtils.findRenderedComponentWithType(
      renderedComponent,
      TelInput
    );

    assert.equal(inputComponent._reactInternalInstance._renderedComponent._tag, 'textarea');
  });

});
