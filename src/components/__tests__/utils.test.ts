import { CountryData } from '../..'
import utils from '../../components/utils'

const countries: CountryData[] = []
const countryCode: string | undefined = undefined
const ignoreOnlyCountriesOption: boolean | undefined = undefined

// Expect null to never be returned when `allowFail` is false in utils.getCountryData().
console.log(utils.getCountryData(
  countries,
  countryCode,
  ignoreOnlyCountriesOption,
  false
))

// Expect null to be returned conditionally when `allowFail` is true in utils.getCountryData().
console.log(utils.getCountryData(
  countries,
  countryCode,
  ignoreOnlyCountriesOption,
  true
))
