import React from 'react'

export interface TelInputProps {
  className?: string
  disabled?: boolean
  readonly?: boolean
  fieldName?: string
  fieldId?: string
  value?: string
  placeholder?: string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleOnBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  handleOnFocus: (event: React.FocusEvent<HTMLInputElement>) => void
  autoFocus?: boolean
  autoComplete?: string
  inputProps?: React.HTMLProps<HTMLInputElement>
  refCallback: (element: HTMLInputElement | null) => void
  cursorPosition?: number
}

export interface TelInputState {
  hasFocus: boolean
}

export default class TelInput extends React.Component<
  TelInputProps,
  TelInputState
> {
  tel?: HTMLInputElement | null

  refHandler: (element: HTMLInputElement | null) => void

  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void

  handleFocus: (event: React.FocusEvent<HTMLInputElement>) => void
}
