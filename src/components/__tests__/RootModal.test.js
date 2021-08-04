import React from 'react'
import { mount } from 'enzyme'
import RootModal from '../RootModal'

// eslint-disable-next-line func-names
describe('RootModal', function() {
  beforeEach(() => {
    jest.resetModules()

    this.makeSubject = () => {
      return mount(
        <RootModal>
          <div className="root">foo</div>
        </RootModal>,
        {
          attachTo: document.body,
        },
      )
    }
  })

  it('should has a div.root tag', () => {
    const subject = this.makeSubject()

    expect(subject.find('div.root').length).toBeTruthy()
  })

  it('should has parent element which has specific className', () => {
    const subject = this.makeSubject()

    expect(subject.instance().modalTarget.classList[0]).toBe('intl-tel-input')
    expect(subject.instance().modalTarget.classList[1]).toBe('iti-container')
  })

  it('should has a modalTarget in body', () => {
    const subject = this.makeSubject()

    subject.setState({
      foo: 'foo',
    })
    expect(subject.instance().modalTarget.classList[0]).toBe('intl-tel-input')
    expect(subject.instance().modalTarget.classList[1]).toBe('iti-container')
  })

  it('should not has a modalTarget in body', () => {
    const subject = this.makeSubject()

    subject.unmount()
    expect(document.body.querySelector('.iti-container')).toBeNull()
  })
})
