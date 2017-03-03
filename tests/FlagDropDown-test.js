import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import IntlTelInput from '../src/containers/IntlTelInputApp';
import sinon from 'sinon';
import fs from 'fs';
import { assert } from 'chai';

describe('FlagDropDown', () => {
  let renderedComponent;
  let flagComponent;
  let dropDownComponent;
  let libphonenumberUtils;
  let xhr;
  let requests;

  beforeEach('render element', () => {
    libphonenumberUtils = fs.readFileSync('./example/assets/libphonenumber.js', 'utf8');
    xhr = sinon.useFakeXMLHttpRequest();
    window.intlTelInputUtils = undefined;
    requests = [];
    xhr.onCreate = (x) => {
      requests.push(x);
    };

    renderedComponent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
      />
    );

    flagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
      renderedComponent,
      'selected-flag'
    );

    dropDownComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
      renderedComponent,
      'country-list'
    );
  });

  afterEach('unmount component', () => {
    xhr.restore();
  });

  it('Rendered', () => {
    assert(ReactTestUtils.isDOMComponent(flagComponent) === true);
  });

  it('Load country via localStorage', () => {
    window.localStorage.setItem('itiAutoCountry', 'jp');
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'auto'}
      />
    );
    assert(parent.state.countryCode === 'jp');
    window.localStorage.clear();
  });

  it('separateDialCode', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        separateDialCode
      />
    );

    assert(findDOMNode(parent).className.indexOf('separate-dial-code') > -1);
  });

  it('Set flag className by country', () => {
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag tw');
  });

  it('Simulate click flag before & after', () => {
    assert(findDOMNode(dropDownComponent).className === 'country-list hide');
    ReactTestUtils.Simulate.click(findDOMNode(flagComponent));
    assert(findDOMNode(dropDownComponent).className === 'country-list');
  });

  it('Simulate change to Japan flag in dropdown before & after', () => {
    assert(renderedComponent.state.showDropdown === false);
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag tw');
    ReactTestUtils.Simulate.click(findDOMNode(flagComponent));
    const japanOption = findDOMNode(dropDownComponent).querySelector('[data-country-code="jp"]');
    ReactTestUtils.Simulate.click(japanOption);
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag jp');
    assert(renderedComponent.state.showDropdown === false);
  });

  it('Set onlyCountries', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        onlyCountries={['tw', 'us', 'kr']}
      />
    );
    const result = [{
      name: 'South Korea (대한민국)',
      iso2: 'kr',
      dialCode: '82',
      priority: 0,
      areaCodes: null,
    }, {
      name: 'Taiwan (台灣)',
      iso2: 'tw',
      dialCode: '886',
      priority: 0,
      areaCodes: null,
    }, {
      name: 'United States',
      iso2: 'us',
      dialCode: '1',
      priority: 0,
      areaCodes: null,
    }];

    assert.deepEqual(parent.refs.flagDropDown.props.countries, result);
  });

  it('Set excludeCountries', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        excludeCountries={['us', 'kr']}
      />
    );
    assert(parent.refs.flagDropDown.props.countries.length === 241);
  });

  it('Set defaultCountry as "auto"', () => {
    const lookup = (callback) => {
      callback('jp');
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'auto'}
        geoIpLookup={lookup}
      />
    );

    assert(parent.state.countryCode === 'jp');
  });

  it('Mouse over on country', () => {
    ReactTestUtils.Simulate.click(findDOMNode(flagComponent));
    const options = findDOMNode(dropDownComponent).querySelectorAll(
      '.country:not([class="preferred"])');
    const koreaOption = findDOMNode(dropDownComponent).querySelector('[data-country-code="kr"]');

    let index = -1;
    for (let i = 0, max = options.length; i < max; ++i) {
      if (options[i] === koreaOption) {
        index = i;
      }
    }

    ReactTestUtils.Simulate.mouseOver(koreaOption);
    assert(renderedComponent.refs.flagDropDown.props.highlightedCountry === index);
  });

  it('Simulate change to flag in dropdown by up and down key', () => {
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag tw');

    ReactTestUtils.Simulate.keyDown(findDOMNode(flagComponent),
      { key: 'Enter', keyCode: 13, which: 13 });
    assert(renderedComponent.state.showDropdown === true);

    ReactTestUtils.Simulate.keyDown(findDOMNode(flagComponent),
      { key: 'Tab', keyCode: 9, which: 9 });
    assert(renderedComponent.state.showDropdown === false);

    ReactTestUtils.Simulate.keyDown(findDOMNode(flagComponent),
      { key: 'Enter', keyCode: 13, which: 13 });
    const pressUpEvent = new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      keyCode: 38,
      key: 'Up',
      which: 38,
    });
    document.dispatchEvent(pressUpEvent);
    assert(renderedComponent.state.highlightedCountry === 212);

    const pressEnterEvent = new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      keyCode: 13,
      key: 'Enter',
      which: 13,
    });
    document.dispatchEvent(pressEnterEvent);
    assert(renderedComponent.state.showDropdown === false);
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag sy');
  });

  it('Simulate close the dropdown menu by ESC key', () => {
    ReactTestUtils.Simulate.keyDown(findDOMNode(flagComponent),
      { key: 'Enter', keyCode: 13, which: 13 });
    assert(renderedComponent.state.showDropdown === true);

    const pressEscEvent = new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      keyCode: 27,
      key: 'Esc',
      which: 27,
    });
    document.dispatchEvent(pressEscEvent);
    assert(renderedComponent.state.showDropdown === false);
  });

  it('Simulate close the dropdown menu by clicking on document', () => {
    ReactTestUtils.Simulate.keyDown(findDOMNode(flagComponent),
      { key: 'Enter', keyCode: 13, which: 13 });
    assert(renderedComponent.state.showDropdown === true);

    const clickEvent = new window.MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    document.querySelector('html').dispatchEvent(clickEvent);
    assert(renderedComponent.state.showDropdown === false);
  });

  it('componentWillUnmount', () => {
    ReactTestUtils.Simulate.keyDown(findDOMNode(flagComponent),
      { key: 'Enter', keyCode: 13, which: 13 });
    assert(renderedComponent.state.showDropdown === true);

    renderedComponent.componentWillUnmount();

    const clickEvent = new window.MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    document.querySelector('html').dispatchEvent(clickEvent);
    assert(renderedComponent.state.showDropdown === true);
  });

  it('Simulate search country name in dropdown menu', () => {
    ReactTestUtils.Simulate.keyDown(findDOMNode(flagComponent),
      { key: 'Enter', keyCode: 13, which: 13 });
    assert(renderedComponent.state.showDropdown === true);

    const pressJEvent = new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      keyCode: 74,
      key: 'J',
      which: 74,
    });
    const pressAEvent = new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      keyCode: 65,
      key: 'A',
      which: 65,
    });
    const pressPEvent = new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      keyCode: 80,
      key: 'P',
      which: 80,
    });
    document.dispatchEvent(pressJEvent);
    document.dispatchEvent(pressAEvent);
    document.dispatchEvent(pressPEvent);
    const pressEnterEvent = new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      keyCode: 13,
      key: 'Enter',
      which: 13,
    });
    document.dispatchEvent(pressEnterEvent);

    assert(renderedComponent.state.showDropdown === false);
    assert(renderedComponent.state.highlightedCountry === 108);
    assert(renderedComponent.state.countryCode === 'jp');
  });

  it('customPlaceholder', () => {
    requests[0].respond(200,
      { 'Content-Type': 'text/javascript' },
      libphonenumberUtils);

    let expected = '';
    const customPlaceholder = (placeholder, countryData) => {
      expected = `${placeholder},${countryData.iso2}`;
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
        customPlaceholder={customPlaceholder}
      />
    );

    const parentFlagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
      parent,
      'selected-flag'
    );

    const parentDropDownComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
      parent,
      'country-list'
    );

    assert(expected === '0912 345 678,tw');
    ReactTestUtils.Simulate.click(findDOMNode(parentFlagComponent));
    const japanOption = findDOMNode(
      parentDropDownComponent).querySelector('[data-country-code="jp"]');
    ReactTestUtils.Simulate.click(japanOption);
    assert(expected === '090-1234-5678,jp');
  });

  it('onSelectFlag', () => {
    let expected = '';
    const onSelectFlag = (status, currentNumber, countryData) => {
      expected = Object.assign({}, { status, currentNumber, ...countryData });
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        utilsScript={'../example/assets/libphonenumber.js'}
        onSelectFlag={onSelectFlag}
      />
    );

    const parentFlagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
      parent,
      'selected-flag'
    );

    const parentDropDownComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
      parent,
      'country-list'
    );

    ReactTestUtils.Simulate.click(findDOMNode(parentFlagComponent));
    const japanOption = findDOMNode(
      parentDropDownComponent).querySelector('[data-country-code="jp"]');
    ReactTestUtils.Simulate.click(japanOption);

    assert.deepEqual(expected, {
      status: false,
      currentNumber: '',
      name: 'Japan (日本)',
      iso2: 'jp',
      dialCode: '81',
      priority: 0,
      areaCodes: null,
    });
  });
});
