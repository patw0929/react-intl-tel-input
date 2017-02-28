/* eslint-disable no-eval */
import React from 'react';
import { mount } from 'enzyme';
import RootModal from '../src/components/RootModal';

describe('RootModal', function () { // eslint-disable-line func-names
  beforeEach(() => {
    jest.resetModules();

    this.makeSubject = () => {
      return mount(
        <RootModal>
          <div>foo</div>
        </RootModal>,
        {
          attachTo: document.body,
        },
      );
    };
  });

  it('should has a noscript tag', () => {
    const subject = this.makeSubject();

    expect(subject.find('noscript').length).toBeTruthy();
  });

  it('should has parent element which has specific className"', () => {
    const subject = this.makeSubject();

    expect(subject.instance().modalTarget.classList[0]).toBe('intl-tel-input');
    expect(subject.instance().modalTarget.classList[1]).toBe('iti-container');
  });

  it('should has a modalTarget in body', () => {
    const subject = this.makeSubject();

    subject.setState({
      foo: 'foo',
    });
    expect(subject.instance().modalTarget.classList[0]).toBe('intl-tel-input');
    expect(subject.instance().modalTarget.classList[1]).toBe('iti-container');
  });

  it('should not has a modalTarget in body', () => {
    const subject = this.makeSubject();

    subject.unmount();
    expect(document.body.querySelector('.iti-container')).toBeNull();
  });
});
