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
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag tw');
    ReactTestUtils.Simulate.click(findDOMNode(flagComponent));
    const japanOption = findDOMNode(dropDownComponent).querySelector('[data-country-code="jp"]');
    ReactTestUtils.Simulate.click(japanOption);
    assert(findDOMNode(flagComponent).querySelector('.iti-flag').className === 'iti-flag jp');
  });
});
