import { CountryData } from '../types'

declare const AllCountries: {
  initialize(externalCountriesList: [
    CountryData['name'],
    CountryData['iso2'],
    CountryData['dialCode'],
    CountryData['priority'],
    CountryData['areaCodes']
  ][]): void
  getCountries(): CountryData[]
}

export default AllCountries
