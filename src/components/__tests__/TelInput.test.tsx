import React from 'react'

import TelInput from '../TelInput'

const App: React.FunctionComponent = () => {
  const telInputComponentRef = React.useRef<TelInput | null>(null)
  const inputElementRef = React.useRef<HTMLInputElement | null>(null)
  const refCallback = (instance: HTMLInputElement | null) => {
    inputElementRef.current = instance
  }

  const init = () => {
    const { current: telInputComponent } = telInputComponentRef
    if (telInputComponent == null) {
      return
    }

    const { current: inputElement } = inputElementRef
    if (inputElement == null) {
      return
    }

    inputElement.focus()
    console.log('inputElement.focus()')
    console.log('telInputComponent.state.hasFocus', telInputComponent.state.hasFocus)
    console.log('telInputComponent.tel', telInputComponent.tel)
  }

  React.useEffect(() => {
    init()
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleInputChange', event.target.value)
  }

  const handleOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log('handleOnFocus', event.target.value)
  }

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log('handleOnBlur', event.target.value)
  }

  return (
    <TelInput
      ref={telInputComponentRef}
      refCallback={refCallback}
      handleInputChange={handleInputChange}
      handleOnFocus={handleOnFocus}
      handleOnBlur={handleOnBlur}
    />
  )
}

React.createElement(App)
