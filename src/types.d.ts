export interface CountryData {
  /** Country name. */
  name?: string
  /** ISO 3166-1 alpha-2 code. */
  iso2?: string
  /** International dial code. */
  dialCode?: string
  /** Order (if >1 country with same dial code). */
  priority?: number
  /** Area codes (if >1 country with same dial code). */
  areaCodes?: string[] | null
}
