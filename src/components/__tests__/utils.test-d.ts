import { expectType } from 'tsd'
import { CountryData } from '../..'
import utils from '../../components/utils'

// Expect the predicate to do a matching operation on each item in the array of generic items passed to the first argument utils.findIndex().
// e.g. item is CountryData, (items: CountryData, predicate: (item: CountryData) => boolean) => number
type FindIndexFunction<F extends <I>(items: I[], predicate: (item: I) => boolean | undefined) => number> = F
expectType<FindIndexFunction<typeof utils.findIndex>>(utils.findIndex)

const countries: CountryData[] = []
const countryCode: string | undefined = undefined
const ignoreOnlyCountriesOption: boolean | undefined = undefined

// Expect null to never be returned when `allowFail` is false in utils.getCountryData().
expectType<CountryData>(utils.getCountryData(
  countries,
  countryCode,
  ignoreOnlyCountriesOption,
  false
))

// Expect null to be returned conditionally when `allowFail` is true in utils.getCountryData().
expectType<CountryData | null>(utils.getCountryData(
  countries,
  countryCode,
  ignoreOnlyCountriesOption,
  true
))
