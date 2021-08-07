import React from 'react'

export interface FlagBoxProps {
  dialCode: string
  isoCode: string
  name: string
  onMouseOver?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  onFocus?: (event: React.FocusEvent<HTMLLIElement>) => void
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  flagRef?: (instance: HTMLDivElement | null) => void
  innerFlagRef?: (instance: HTMLDivElement | null) => void
  countryClass: string
}

declare const FlagBox: React.FunctionComponent<FlagBoxProps>

export default FlagBox
