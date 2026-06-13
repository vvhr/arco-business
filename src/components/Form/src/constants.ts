import type { FormInputName } from './types'

export const SchemaType = {
  STEP: 'Step',
  CONTAINER: 'Container',
  DECORATOR: 'Decorator',
  INPUTER: 'Inputer',
  CUSTOM: 'Custom'
} as const

export const needAllowClear: FormInputName[] = [
  'AutoComplete',
  'Cascader',
  'DatePicker',
  'RangePicker',
  'Input',
  'InputNumber',
  'InputTag',
  'Mention',
  'Select',
  'TimePicker',
  'TreeSelect'
]

export const needOptions: FormInputName[] = [
  'Cascader',
  'CheckboxGroup',
  'Mention',
  'RadioGroup',
  'Select'
]

export const needDataOptions: FormInputName[] = ['Transfer', 'TreeSelect']

export const needInputPlaceholder: FormInputName[] = [
  'AutoComplete',
  'Input',
  'InputNumber',
  'Mention',
  'InputTag',
  'Textarea'
]

export const needSelectPlaceholder: FormInputName[] = [
  'Cascader',
  'DatePicker',
  'Select',
  'TimePicker',
  'TreeSelect'
]

export const needRangePlaceholder: FormInputName[] = ['RangePicker']

export const componentsNeedingRef: FormInputName[] = ['Table']
