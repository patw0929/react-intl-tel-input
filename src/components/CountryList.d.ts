import React from 'react'
import { CountryData } from '../types'

export type CountryListProps = {
  setFlag?: (iso2: string) => void
  countries?: CountryData[]
  inputTop?: number
  inputOuterHeight?: number
  preferredCountries?: CountryData
  highlightedCountry?: number
  changeHighlightCountry?: (showDropdown: boolean, selectedIndex: number) => void
  showDropdown?: boolean
  isMobile?: boolean
  dropdownContainer?: string
}

export type CountryListState = {

}

export default class CountryList extends React.Component<CountryListProps, CountryListState> {
  listElement?: HTMLUListElement | null
  setDropdownPosition(): void
  appendListItem(countries: CountryData[], isPreferred?: boolean): React.ReactNode
  handleMouseOver: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}
