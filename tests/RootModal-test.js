/* eslint-disable no-eval */
import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import RootModal from '../src/components/RootModal';
import { assert } from 'chai';

describe('RootModal', () => {
  let renderedComponent;

  beforeEach('Render element', () => {
    renderedComponent = ReactTestUtils.renderIntoDocument(
      <RootModal>
        <div>foo</div>
      </RootModal>
    );
  });

  afterEach(() => {
    if (renderedComponent) {
      ReactDOM.unmountComponentAtNode(
        ReactDOM.findDOMNode(renderedComponent).parentNode);
    }
  });

  it('is a noscript tag', () => {
    assert(findDOMNode(renderedComponent).tagName.toLowerCase() === 'noscript');
  });

  it('has parent element which has specific className"', () => {
    assert(renderedComponent.modalTarget.classList[0] === 'intl-tel-input');
    assert(renderedComponent.modalTarget.classList[1] === 'iti-container');
  });

  it('has a modalTarget in body', () => {
    renderedComponent.setState({
      foo: 'foo',
    });
    assert(renderedComponent.modalTarget.classList[0] === 'intl-tel-input');
    assert(renderedComponent.modalTarget.classList[1] === 'iti-container');
  });
});
