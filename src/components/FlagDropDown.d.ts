import React from 'react'

import { CountryData } from '../types'

import CountryList from './CountryList'

export interface FlagDropDownProps {
  allowDropdown?: boolean
  dropdownContainer?: React.ElementType | string
  separateDialCode?: boolean
  dialCode?: string
  countryCode?: string
  showDropdown?: boolean
  clickSelectedFlag?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
  handleSelectedFlagKeydown?: (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => void
  isMobile?: boolean
  setFlag?: (iso2: string) => void
  countries?: CountryData[]
  inputTop?: number
  inputOuterHeight?: number
  preferredCountries?: CountryData[]
  highlightedCountry?: number
  changeHighlightCountry?: (
    showDropdown: boolean,
    selectedIndex: number,
  ) => void
  titleTip?: string
  refCallback: (instance: HTMLDivElement | null) => void
}

export interface FlagDropDownState {}

export default class FlagDropDown extends React.Component<
  FlagDropDownProps,
  FlagDropDownState
> {
  countryList?: CountryList | null

  genSelectedDialCode: () => React.ReactNode

  genArrow: () => React.ReactNode

  genFlagClassName: () => string

  genCountryList: () => React.ReactNode
}
