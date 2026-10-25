export type AmountModelValue = string | number | null
export type AmountEmptyValue = null | string | number
export interface AmountInputProps {
  modelValue?: AmountModelValue
  emptyValue?: AmountEmptyValue
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  precision?: number
  showChineseUppercase?: boolean
  uppercasePlaceholder?: string
  useThousandSeparatorInEdit?: boolean
  useThousandSeparatorInReadonly?: boolean
}
export interface AmountInputEmits {
  'update:modelValue': [value: AmountModelValue]
  change: [value: AmountModelValue]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}
export interface NormalizedAmountInputResult {
  display: string
  normalized: string
  output: AmountModelValue
}
