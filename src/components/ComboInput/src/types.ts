import type { ExtractPropTypes, PropType } from 'vue'

/**
 * 组合模板项的标签类型
 */
export type ComboTemplateTag = 'span' | 'select' | 'input' | 'date-picker' | 'range-picker'

export type ComboInputSize = 'mini' | 'small' | 'medium' | 'large'

/**
 * Arco Input 常用属性
 */
export interface InputComponentProps {
  placeholder?: string
  allowClear?: boolean
  maxLength?: number | { length: number; errorOnly?: boolean }
  showWordLimit?: boolean
  type?: 'text' | 'password'
  readonly?: boolean
  error?: boolean
  inputAttrs?: Record<string, any>
  prepend?: string
  append?: string
}

/**
 * Arco Select 常用属性
 */
export interface SelectComponentProps {
  placeholder?: string
  allowClear?: boolean
  allowSearch?: boolean
  multiple?: boolean
  limit?: number
  loading?: boolean
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  valueKey?: string
  popupContainer?: string | HTMLElement
  bordered?: boolean
  allowCreate?: boolean
  filterOption?: boolean | ((inputValue: string, option: any) => boolean)
  fallbackOption?: boolean | ((value: any) => any)
  triggerProps?: Record<string, any>
  fieldNames?: Record<string, string>
}

/**
 * Arco DatePicker 常用属性
 */
export interface DatePickerComponentProps {
  placeholder?: string
  allowClear?: boolean
  format?: string
  valueFormat?: string
  mode?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  showTime?: boolean
  showNowBtn?: boolean
  showConfirm?: boolean
  defaultValue?: Date | string | number
  shortcuts?: Array<{
    label: string | number
    value: Date | string | number | (() => Date | string | number)
  }>
  disabledDate?: (date: Date) => boolean
  readonly?: boolean
  error?: boolean
  position?: 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br'
  popupVisible?: boolean
  defaultPopupVisible?: boolean
  triggerProps?: Record<string, any>
}

/**
 * Arco RangePicker 常用属性
 */
export interface RangePickerComponentProps {
  placeholder?: string[]
  allowClear?: boolean
  format?: string
  valueFormat?: string
  mode?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  showTime?: boolean
  showConfirm?: boolean
  separator?: string
  defaultValue?: Array<Date | string | number>
  defaultPickerValue?: Array<Date | string | number>
  shortcuts?: Array<{
    label: string | number
    value: Array<Date | string | number> | (() => Array<Date | string | number>)
  }>
  disabledDate?: (date: Date, type: 'start' | 'end') => boolean
  readonly?: boolean
  error?: boolean
  position?: 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br'
  popupVisible?: boolean
  defaultPopupVisible?: boolean
  triggerProps?: Record<string, any>
}

/**
 * 组合类型：已知属性 + 任意扩展属性
 */
export type ComboComponentProps<T extends object = object> = T & Record<string, any>

/**
 * 根据 tag 类型获取对应的 componentProps 类型
 */
export type ComponentPropsMap = {
  input: ComboComponentProps<InputComponentProps>
  select: ComboComponentProps<SelectComponentProps>
  'date-picker': ComboComponentProps<DatePickerComponentProps>
  'range-picker': ComboComponentProps<RangePickerComponentProps>
  span: never
}

/**
 * 组合模板项配置
 */
export interface ComboTemplate<T extends ComboTemplateTag = ComboTemplateTag> {
  /**
   * 组件标签类型
   */
  tag: T
  /**
   * 输入性组件的自定义变量名，若未定义组件会自动生成一个如: select_1
   */
  prop?: string
  /**
   * 非输入性组件的文本内容
   */
  content?: string
  /**
   * 输入性组件的自身属性
   */
  componentProps?: T extends keyof ComponentPropsMap ? ComponentPropsMap[T] : never
}

/**
 * 内部模板模型类型
 */
export type TemplateModel = Record<string, any>

/**
 * ComboInput 组件的 Props 定义
 */
export const comboInputProps = {
  /**
   * 组合输入的完整值（字符串）
   */
  modelValue: {
    type: String,
    default: ''
  },
  /**
   * 组合模板配置（字符串模板或详细配置数组）
   */
  template: {
    type: [String, Array] as PropType<string | ComboTemplate[]>,
    required: true
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * 尺寸
   */
  size: {
    type: String as PropType<ComboInputSize>,
    default: 'medium'
  },
  /**
   * 输入防抖延迟时间（毫秒），0 表示不防抖
   */
  debounce: {
    type: Number,
    default: 0
  }
} as const

/**
 * ComboInput 组件的 Props 类型
 */
export type ComboInputProps = ExtractPropTypes<typeof comboInputProps>

/**
 * Change 事件参数类型
 */
export interface ComboInputChangeEvent {
  value: string
  params: TemplateModel
}

/**
 * ComboInput 组件的 Emits 定义
 */
export const comboInputEmits = {
  /**
   * 更新 modelValue
   * @param value 新的值
   */
  'update:modelValue': (value: string) => typeof value === 'string',
  /**
   * 值变化事件
   * @param event 包含完整值和参数的对象
   */
  change: (event: ComboInputChangeEvent) => true
}

/**
 * ComboInput 组件的 Emits 类型
 */
export type ComboInputEmits = typeof comboInputEmits
