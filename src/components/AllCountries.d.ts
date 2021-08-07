import { CountryData } from '../types'

type ExternalCountry = [
  CountryData['name'],
  CountryData['iso2'],
  CountryData['dialCode'],
  CountryData['priority'],
  CountryData['areaCodes'],
]

interface AllCountriesStatic {
  initialize(externalCountriesList: ExternalCountry[]): void
  getCountries(): CountryData[]
}

declare const AllCountries: AllCountriesStatic

export default AllCountries
