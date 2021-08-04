/* eslint-disable react/no-find-dom-node, no-eval */
import React from 'react'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'
import { mount } from 'enzyme'
import IntlTelInput from '../IntlTelInput'
import FlagDropDown from '../FlagDropDown'
import CountryList from '../CountryList'
import TelInput from '../TelInput'

// eslint-disable-next-line func-names
describe('FlagDropDown', function() {
  beforeEach(() => {
    jest.resetModules()

    this.params = {
      containerClassName: 'intl-tel-input',
      inputClassName: 'form-control phoneNumber',
      fieldName: 'telephone',
      defaultCountry: 'tw',
    }

    this.makeSubject = () => {
      return mount(<IntlTelInput {...this.params} />)
    }
  })

  it('should be rendered', () => {
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)
    const countryListComponent = subject.find(CountryList)

    expect(flagComponent.length).toBeTruthy()
    expect(countryListComponent.length).toBeTruthy()
  })

  it('should load country "jp" from localStorage', async () => {
    window.localStorage.setItem('itiAutoCountry', 'jp')
    this.params = {
      ...this.params,
      defaultCountry: 'auto',
    }
    const subject = await this.makeSubject()

    subject.instance().utilsScriptDeferred.then(() => {
      expect(subject.state().countryCode).toBe('jp')
      window.localStorage.clear()
    })
  })

  it('should fallback to US when localStorage is not available', async () => {
    const mockedLocalStorage = window.localStorage
    // This will cause calls to localStorage.getItem() to throw
    window.localStorage = {}

    this.params = {
      ...this.params,
      defaultCountry: 'auto',
    }
    const subject = await this.makeSubject()

    subject.instance().utilsScriptDeferred.then(() => {
      expect(subject.state().countryCode).toBe('us')
      window.localStorage.clear()
    })

    window.localStorage = mockedLocalStorage
  })

  it('should has .separate-dial-code class when with separateDialCode = true', () => {
    this.params = {
      ...this.params,
      separateDialCode: true,
    }
    const subject = this.makeSubject()

    expect(subject.find('.separate-dial-code').length).toBeTruthy()
  })

  it('should has "tw" in class name', () => {
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)

    expect(flagComponent.find('.iti-flag.tw').first().length).toBeTruthy()
  })

  it('should not has .hide class after clicking flag component', () => {
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)

    expect(
      subject.find(CountryList).find('.country-list.hide').length,
    ).toBeTruthy()
    flagComponent
      .find('.selected-flag')
      .last()
      .simulate('click')

    subject.update()
    expect(
      subject.find(CountryList).find('.country-list.hide').length,
    ).toBeFalsy()
  })

  it('Simulate change to Japan flag in dropdown before & after', () => {
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)

    expect(subject.state().showDropdown).toBeFalsy()
    expect(flagComponent.find('.iti-flag.tw').length).toBeTruthy()
    flagComponent.simulate('click')
    const japanOption = flagComponent.find('[data-country-code="jp"]')

    japanOption.simulate('click')
    expect(flagComponent.find('.iti-flag.jp').length).toBeTruthy()
    expect(subject.state().showDropdown).toBeFalsy()
  })

  it('Set onlyCountries', () => {
    this.params.onlyCountries = ['tw', 'us', 'kr']
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)

    const result = [
      {
        name: 'South Korea (대한민국)',
        iso2: 'kr',
        dialCode: '82',
        priority: 0,
        areaCodes: null,
      },
      {
        name: 'Taiwan (台灣)',
        iso2: 'tw',
        dialCode: '886',
        priority: 0,
        areaCodes: null,
      },
      {
        name: 'United States',
        iso2: 'us',
        dialCode: '1',
        priority: 0,
        areaCodes: null,
      },
    ]

    expect(flagComponent.props().countries).toEqual(result)
  })

  it('Set excludeCountries', () => {
    this.params.excludeCountries = ['us', 'kr']
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)

    expect(flagComponent.props().countries.length).toBe(241)
  })

  it('Set defaultCountry as "auto"', async () => {
    const lookup = callback => {
      callback('jp')
    }

    this.params = {
      ...this.params,
      defaultCountry: 'auto',
      geoIpLookup: lookup,
    }
    const subject = await this.makeSubject()

    subject.instance().utilsScriptDeferred.then(() => {
      expect(subject.state().countryCode).toBe('jp')
    })
  })

  describe('with original ReactTestUtils', () => {
    it('Mouse over on country', () => {
      const renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput
          css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName="telephone"
          defaultCountry="tw"
        />,
      )

      const flagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
        renderedComponent,
        'selected-flag',
      )

      const dropDownComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
        renderedComponent,
        'country-list',
      )

      ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(flagComponent))
      const options = ReactDOM.findDOMNode(dropDownComponent).querySelectorAll(
        '.country:not([class="preferred"])',
      )
      const koreaOption = ReactDOM.findDOMNode(dropDownComponent).querySelector(
        '[data-country-code="kr"]',
      )

      let index = -1

      for (let i = 0, max = options.length; i < max; ++i) {
        if (options[i] === koreaOption) {
          index = i
        }
      }

      ReactTestUtils.Simulate.mouseOver(koreaOption)
      expect(renderedComponent.state.highlightedCountry).toBe(index)
    })

    it('Simulate change to flag in dropdown by up and down key', () => {
      const renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput
          css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName="telephone"
          defaultCountry="tw"
        />,
      )

      const flagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
        renderedComponent,
        'selected-flag',
      )

      expect(
        ReactDOM.findDOMNode(flagComponent).querySelector('.iti-flag')
          .className,
      ).toBe('iti-flag tw')

      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(flagComponent), {
        key: 'Enter',
        keyCode: 13,
        which: 13,
      })
      expect(renderedComponent.state.showDropdown).toBeTruthy()

      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(flagComponent), {
        key: 'Tab',
        keyCode: 9,
        which: 9,
      })
      expect(renderedComponent.state.showDropdown).toBeFalsy()

      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(flagComponent), {
        key: 'Enter',
        keyCode: 13,
        which: 13,
      })

      const pressUpEvent = new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
        keyCode: 38,
        key: 'Up',
        which: 38,
      })

      document.dispatchEvent(pressUpEvent)
      expect(renderedComponent.state.highlightedCountry).toBe(212)

      const pressEnterEvent = new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
        keyCode: 13,
        key: 'Enter',
        which: 13,
      })

      document.dispatchEvent(pressEnterEvent)
      expect(renderedComponent.state.showDropdown).toBeFalsy()
      expect(
        ReactDOM.findDOMNode(flagComponent).querySelector('.iti-flag')
          .className === 'iti-flag sy',
      )
    })

    it('Simulate close the dropdown menu by ESC key', () => {
      const renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput
          css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName="telephone"
          defaultCountry="tw"
        />,
      )

      const flagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
        renderedComponent,
        'selected-flag',
      )

      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(flagComponent), {
        key: 'Enter',
        keyCode: 13,
        which: 13,
      })
      expect(renderedComponent.state.showDropdown).toBeTruthy()

      const pressEscEvent = new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
        keyCode: 27,
        key: 'Esc',
        which: 27,
      })

      document.dispatchEvent(pressEscEvent)
      expect(renderedComponent.state.showDropdown).toBeFalsy()
    })

    it('Simulate close the dropdown menu by clicking on document', () => {
      const renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput
          css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName="telephone"
          defaultCountry="tw"
        />,
      )

      const flagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
        renderedComponent,
        'selected-flag',
      )

      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(flagComponent), {
        key: 'Enter',
        keyCode: 13,
        which: 13,
      })
      expect(renderedComponent.state.showDropdown).toBeTruthy()

      const clickEvent = new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })

      document.querySelector('html').dispatchEvent(clickEvent)
      expect(renderedComponent.state.showDropdown).toBeFalsy()
    })

    it('componentWillUnmount', () => {
      const renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput
          css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName="telephone"
          defaultCountry="tw"
        />,
      )

      const flagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
        renderedComponent,
        'selected-flag',
      )

      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(flagComponent), {
        key: 'Enter',
        keyCode: 13,
        which: 13,
      })
      expect(renderedComponent.state.showDropdown).toBeTruthy()

      renderedComponent.componentWillUnmount()

      const clickEvent = new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })

      document.querySelector('html').dispatchEvent(clickEvent)
      expect(renderedComponent.state.showDropdown).toBeTruthy()
    })

    it('Simulate search country name in dropdown menu', () => {
      const renderedComponent = ReactTestUtils.renderIntoDocument(
        <IntlTelInput
          css={['intl-tel-input', 'form-control phoneNumber']}
          fieldName="telephone"
          defaultCountry="tw"
        />,
      )

      const flagComponent = ReactTestUtils.findRenderedDOMComponentWithClass(
        renderedComponent,
        'selected-flag',
      )

      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(flagComponent), {
        key: 'Enter',
        keyCode: 13,
        which: 13,
      })
      expect(renderedComponent.state.showDropdown).toBe(true)

      const pressJEvent = new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
        keyCode: 74,
        key: 'J',
        which: 74,
      })
      const pressAEvent = new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
        keyCode: 65,
        key: 'A',
        which: 65,
      })
      const pressPEvent = new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
        keyCode: 80,
        key: 'P',
        which: 80,
      })

      document.dispatchEvent(pressJEvent)
      document.dispatchEvent(pressAEvent)
      document.dispatchEvent(pressPEvent)
      const pressEnterEvent = new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
        keyCode: 13,
        key: 'Enter',
        which: 13,
      })

      document.dispatchEvent(pressEnterEvent)

      expect(renderedComponent.state.showDropdown).toBeFalsy()
      expect(renderedComponent.state.highlightedCountry).toBe(108)
      expect(renderedComponent.state.countryCode).toBe('jp')
    })
  })

  it('customPlaceholder', () => {
    let expected = ''
    const customPlaceholder = (placeholder, countryData) => {
      expected = `${placeholder},${countryData.iso2}`
    }

    this.params.customPlaceholder = customPlaceholder
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)
    const countryListComponent = subject.find(CountryList)

    expect(expected).toBe('0912 345 678,tw')
    flagComponent.simulate('click')
    const japanOption = countryListComponent.find('[data-country-code="jp"]')

    japanOption.simulate('click')
    expect(expected).toBe('090-1234-5678,jp')
  })

  it('onSelectFlag', () => {
    let expected = ''
    const onSelectFlag = (currentNumber, countryData, fullNumber, isValid) => {
      expected = Object.assign(
        {},
        { currentNumber, fullNumber, isValid, ...countryData },
      )
    }

    this.params.onSelectFlag = onSelectFlag
    const subject = this.makeSubject()
    const flagComponent = subject.find(FlagDropDown)
    const inputComponent = subject.find(TelInput)
    const countryListComponent = subject.find(CountryList)

    inputComponent.simulate('change', { target: { value: '+8109012345678' } })
    flagComponent.simulate('click')
    const japanOption = countryListComponent.find('[data-country-code="jp"]')

    japanOption.simulate('click')

    expect(expected).toEqual({
      currentNumber: '+8109012345678',
      fullNumber: '+81 90-1234-5678',
      isValid: true,
      name: 'Japan (日本)',
      iso2: 'jp',
      dialCode: '81',
      priority: 0,
      areaCodes: null,
    })
  })

  it('should output formatted number with formatNumber function', () => {
    this.params.format = true
    this.params.nationalMode = true
    const subject = this.makeSubject()

    expect(subject.instance().formatNumber('+886 912 345 678')).toBe(
      '0912 345 678',
    )
  })

  it('should highlight country from preferred list', async () => {
    const { defaultCountry } = this.params

    this.params = {
      ...this.params,
      preferredCountries: ['us', 'gb', defaultCountry],
    }
    const subject = await this.makeSubject()

    expect(defaultCountry).toBeTruthy()
    expect(subject.state().highlightedCountry).toBe(2)
  })
})
