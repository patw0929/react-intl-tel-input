import { CountryData } from '../types'

interface UtilsStatic {
  arraysEqual: (a: any, b: any) => boolean

  shallowEquals: (a: any, b: any) => boolean

  trim: (str?: string) => string

  isNumeric: (obj: any) => obj is number

  retrieveLiIndex: (node?: HTMLElement) => number

  getNumeric: (s: string) => string

  startsWith: (a: string, b: string) => boolean

  isWindow: (obj?: any) => obj is Window

  getWindow: (elem: any) => Window

  offset: (
    elem: HTMLElement,
  ) => {
    top: number
    left: number
  }

  getOuterHeight: (element: HTMLElement) => number

  getCountryData: {
    // utils.getCountryData([], undefined, undefined,  ) <---- The last variable has not been given and is therefore, `undefined`.
    //                      ^^  ^^^^^^^^^  ^^^^^^^^^  ^
    //                      1       2          3      4
    // Declare this one first so that when the compiler infers the type returned from the invoke pattern above,
    // it assumes the user wants this overloadable function instead of the next one when the 4th variable is actually `undefined`.
    (
      countries: CountryData[],
      countryCode?: string,
      ignoreOnlyCountriesOption?: boolean,
      allowFail?: false,
      errorHandler?: (failedCountryCode: string) => void,
    ): CountryData

    // Evaluate second so that when called without an `allowFail` set to `true`, the first overload is the assumed returned type.
    // Questionmarked parameters (i.e. optional arguments) can't be used here, because `allowFail` must be `true` in order to
    // obtain this function's returned type.
    //
    // Example:
    // utils.getCountryData([], undefined, undefined, true) <---- There's no other way to achieve optional argument 1 & 2.
    (
      countries: CountryData[],
      countryCode: string | undefined,
      ignoreOnlyCountriesOption: boolean | undefined,
      allowFail: true,
    ): CountryData | null
  }

  findIndex: <T>(
    items: T[],
    predicate: (item: T) => boolean | undefined,
  ) => number

  getCursorPositionAfterFormating: (
    prevBeforeCursor?: string,
    prev?: string,
    next?: string,
  ) => number
}

declare const utils: UtilsStatic

export default utils
