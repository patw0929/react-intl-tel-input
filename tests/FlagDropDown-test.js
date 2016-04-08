import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import IntlTelInput from '../src/containers/IntlTelInputApp';
import { assert } from 'chai';

describe('FlagDropDown', () => {
  let renderedComponent;
  let flagComponent;
  let dropDownComponent;

  beforeEach('render element', () => {
    renderedComponent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
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

  it('Rendered', () => {
    assert(ReactTestUtils.isDOMComponent(flagComponent) === true);
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
    assert(renderedComponent.state.countryList.showDropdown === false);
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag tw');
    ReactTestUtils.Simulate.click(findDOMNode(flagComponent));
    const japanOption = findDOMNode(dropDownComponent).querySelector('[data-country-code="jp"]');
    ReactTestUtils.Simulate.click(japanOption);
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag jp');
    assert(renderedComponent.state.countryList.showDropdown === false);
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
});
