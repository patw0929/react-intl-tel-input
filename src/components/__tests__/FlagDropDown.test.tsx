import React from 'react'
import FlagDropDown from '../../components/FlagDropDown'

const App: React.FunctionComponent = () => {
  const flagDropDownComponentRef = React.useRef<FlagDropDown | null>(null)
  const flagDropDownElementRef = React.useRef<HTMLDivElement | null>(null)
  const refCallback = (instance: HTMLDivElement | null) => {
    flagDropDownElementRef.current = instance
  }

  const init = () => {
    const { current: flagDropDownComponent } = flagDropDownComponentRef
    if (flagDropDownComponent == null) {
      return
    }

    const { current: flagDropDownElement } = flagDropDownElementRef
    if (flagDropDownElement == null) {
      return
    }

    console.log('flagDropDownElement.className', flagDropDownElement.className)
    console.log('flagDropDownComponent.countryList', flagDropDownComponent.countryList)

    console.log('flagDropDownComponent.genArrow()', flagDropDownComponent.genArrow())
    console.log('flagDropDownComponent.genCountryList()', flagDropDownComponent.genCountryList())
    console.log('flagDropDownComponent.genSelectedDialCode()', flagDropDownComponent.genSelectedDialCode())
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <FlagDropDown
      ref={flagDropDownComponentRef}
      refCallback={refCallback}
    />
  )
}

React.createElement(App)
