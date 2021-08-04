import React from 'react'
import { shallow } from 'enzyme'

import IntlTelInput from '../IntlTelInput'

describe('Style customization', () => {
  it('correctly applies user-supplied classes on outer container', () => {
    const component = shallow(<IntlTelInput />)
    const mockClass = 'mock-class-1'
    component.setProps({ containerClassName: mockClass })
    expect(component.props().className).toMatchInlineSnapshot(
      `"allow-dropdown mock-class-1"`,
    )
    const otherMockClass = 'mock-class-2'
    component.setProps({ containerClassName: otherMockClass })
    expect(component.props().className).toMatchInlineSnapshot(
      `"allow-dropdown mock-class-2"`,
    )
  })
})
