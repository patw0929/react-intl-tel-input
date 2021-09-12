import { CountryData } from '../../types'
import utils from '../utils'

const countries: CountryData[] = []
const countryCode: string | undefined = undefined
const ignoreOnlyCountriesOption: boolean | undefined = undefined

// Expect null to never be returned when `allowFail` is false in utils.getCountryData().
console.log(
  utils.getCountryData(
    countries,
    countryCode,
    ignoreOnlyCountriesOption,
    false,
    country => `${country}!!`,
  ),
)

// Expect null to be returned conditionally when `allowFail` is true in utils.getCountryData().
// eslint-disable-next-line prettier/prettier
console.log(
  utils.getCountryData(
    countries,
    countryCode,
    true,
    true,
  ),
)
