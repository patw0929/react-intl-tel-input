import React from 'react'
import { mount } from 'enzyme'
import RootModal from '../RootModal'

// eslint-disable-next-line func-names
describe('RootModal', function() {
  beforeEach(() => {
    jest.resetModules()

    const rootElement = document.createElement('div')
    document.body.appendChild(rootElement)

    this.getRootElement = () => {
      return rootElement
    }

    this.makeSubject = () => {
      return mount(
        <RootModal>
          <div className="content">foo</div>
        </RootModal>,
        {
          attachTo: rootElement,
        },
      )
    }
  })

  it('should has a div.content tag', () => {
    const subject = this.makeSubject()

    expect(subject.find('div.content').length).toBeTruthy()
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
    expect(this.getRootElement().querySelector('.iti-container')).toBeNull()
  })
})
