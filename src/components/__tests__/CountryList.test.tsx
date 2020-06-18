import React from 'react'
import CountryList from '../../components/CountryList'
import AllCountries from '../../components/AllCountries'

const App: React.FunctionComponent = () => {
  const countryListComponentRef = React.useRef<CountryList | null>(null)

  const init = () => {
    const { current: countryListComponent } = countryListComponentRef
    if (countryListComponent == null) {
      return
    }

    console.log('countryListComponent.listElement', countryListComponent.listElement)
    countryListComponent.appendListItem([
      {
        name: '',
        iso2: '',
        dialCode: '',
        priority: 0,
        areaCodes: null,
      }
    ], false)
  }

  React.useEffect(() => {
    init()
  }, [])

  const countries = AllCountries.getCountries()
  const changeHighlightCountry = (showDropdown: boolean, selectedIndex: number) => {
    console.log(showDropdown, selectedIndex)
  };
  const setFlag = (iso2: string) => {
    console.log(iso2)
  }

  return (
    <CountryList
      ref={countryListComponentRef}
      countries={countries}
      changeHighlightCountry={changeHighlightCountry}
      highlightedCountry={0}
      setFlag={setFlag}
      isMobile
      showDropdown
    />
  )
}

React.createElement(App)
