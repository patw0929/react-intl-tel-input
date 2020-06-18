import React from 'react'
import IntlTelInput, { CountryData } from '../..'

type AppProps = {}
type AppState = {
  value: string
  fullNumber: string
  iso2: string
}

class App extends React.Component<AppProps, AppState> {
  intlTelInput: React.RefObject<IntlTelInput> = React.createRef()

  state: AppState = {
    value: '',
    fullNumber: '',
    iso2: '',
  }

  handlePhoneNumberChange = (
    isValid: boolean,
    value: string,
    seletedCountryData: CountryData,
    fullNumber: string,
    extension: string
  ) => {
    console.log(value, fullNumber)
    const { iso2 = '' } = seletedCountryData

    this.setState({
      value: value,
      fullNumber: fullNumber,
      iso2: iso2
    })
  }

  handlePhoneNumberBlur = (
    isValid: boolean,
    value: string,
    seletedCountryData: CountryData,
    fullNumber: string,
    extension: string,
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    console.log('Blur event', event)
    console.log('Native event type:', event.type)
    console.log('Details:')
    console.log({ isValid, value, seletedCountryData, fullNumber, extension, event })
  }

  handlePhoneNumberFocus = (
    isValid: boolean,
    value: string,
    seletedCountryData: CountryData,
    fullNumber: string,
    extension: string,
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    console.log('Focus event')
    console.log('Native event type:', event.type)
    console.log('Details:')
    console.log({ isValid, value, seletedCountryData, fullNumber, extension, event })
  }

  render() {
    const { value, fullNumber } = this.state

    return (
      <div>
        <IntlTelInput
          ref={this.intlTelInput}
          onPhoneNumberChange={this.handlePhoneNumberChange}
          onPhoneNumberBlur={this.handlePhoneNumberBlur}
          onPhoneNumberFocus={this.handlePhoneNumberFocus}
          value={value}
        />
        <div>Full number: {fullNumber}</div>
      </div>
    )
  }
}

React.createElement(App)
