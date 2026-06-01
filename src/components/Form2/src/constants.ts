import type { AbFormInputName } from './types'

export const SchemaType = {
  STEP: 'Step',
  CONTAINER: 'Container',
  DECORATOR: 'Decorator',
  INPUTER: 'Inputer',
  CUSTOM: 'Custom'
} as const

export const needAllowClear: AbFormInputName[] = [
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

export const needOptions: AbFormInputName[] = [
  'Cascader',
  'CheckboxGroup',
  'Mention',
  'RadioGroup',
  'Select'
]

export const needDataOptions: AbFormInputName[] = ['Transfer', 'TreeSelect']

export const needInputPlaceholder: AbFormInputName[] = [
  'AutoComplete',
  'Input',
  'InputNumber',
  'Mention',
  'InputTag'
]

export const needSelectPlaceholder: AbFormInputName[] = [
  'Cascader',
  'DatePicker',
  'Select',
  'TimePicker',
  'TreeSelect'
]

export const needRangePlaceholder: AbFormInputName[] = ['RangePicker']

export const componentsNeedingRef: AbFormInputName[] = ['Table']
