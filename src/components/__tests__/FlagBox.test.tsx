import React from 'react'

import FlagBox from '../FlagBox'

const App = () => {
  const flagRef = React.useRef<HTMLDivElement | null>(null)
  const flagRefCallback = (instance: HTMLDivElement | null) => {
    flagRef.current = instance
  }

  const innerFlagRef = React.useRef<HTMLDivElement | null>(null)
  const innerFlagRefCallback = (instance: HTMLDivElement | null) => {
    innerFlagRef.current = instance
  }

  const init = () => {
    const { current: flag } = flagRef
    const { current: innerFlag } = flagRef

    if (flag == null || innerFlag == null) {
      return
    }

    console.log('flag.className', flag.className)
    console.log('innerFlag.className', innerFlag.className)
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <FlagBox
      dialCode="1"
      isoCode="us"
      name="United States"
      countryClass="country"
      flagRef={flagRefCallback}
      innerFlagRef={innerFlagRefCallback}
    />
  )
}

React.createElement(App)
