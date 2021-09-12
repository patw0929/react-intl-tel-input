import React from 'react'

import RootModal from '../RootModal'

const App: React.FunctionComponent = () => {
  const rootModalComponentRef = React.useRef<RootModal | null>(null)

  const init = () => {
    const { current: rootModalComponent } = rootModalComponentRef
    if (rootModalComponent == null) {
      return
    }

    const { modalTarget } = rootModalComponent
    if (modalTarget == null) {
      return
    }

    console.log('modalTarget', modalTarget)
    console.log('modalTarget.className', modalTarget.className)
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <RootModal ref={rootModalComponentRef} />
  )
}

React.createElement(App)
