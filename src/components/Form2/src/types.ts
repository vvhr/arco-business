import type {
  FieldRule,
  FormInstance as ArcoFormInstance,
  ValidatedError
} from '@arco-design/web-vue'
import type { Component, CSSProperties, Slots, VNode, VNodeChild } from 'vue'
import type { AutoRules } from '@/types/rules'

type ArcoFormPublicProps = InstanceType<typeof import('@arco-design/web-vue')['Form']>['$props']
type ArcoFormItemPublicProps = InstanceType<
  typeof import('@arco-design/web-vue')['FormItem']
>['$props']

export type AbFormSize = 'mini' | 'small' | 'medium' | 'large'
export type AbFormLayout = 'horizontal' | 'vertical' | 'inline'
export type AbFormLabelAlign = 'left' | 'right'
export type AbFormDisabledStyles = {
  textColor?: false | string
  borderColor?: false | string
  bgColor?: false | string
  noPadding?: boolean
  defaultCursor?: boolean
  noSuffix?: boolean
}
export type AbFormValidationErrors = Record<string, ValidatedError>

export interface AbFormSlots extends Slots {
  [key: string]: (form: Recordable) => any
  [key: `${string}--label`]: () => any
  [key: `${string}--error`]: () => any
  [key: `${string}--extra`]: () => any
  [key: `${string}--help`]: () => any
  [key: `${string}--${string}`]: (data: { form: Recordable; [key: string]: any }) => any
  [key: `${string}--out-prepend`]: (form: Recordable) => any
  [key: `${string}--out-append`]: (form: Recordable) => any
  design?: (schema: AbFormSchema) => any
}

export interface AbFormEmits {
  (e: 'register', formRef: AbFormRawInstance | undefined): void
  (e: 'update:stepValue', stepValue: number | null): void
  (e: 'init', form: Recordable): void
  (e: 'change', data: { value: any; field: string; oldValue: any }): void
  (e: 'update:model', model: Recordable): void
}

export interface AbFormProps
  extends Omit<
    Partial<ArcoFormPublicProps>,
    | 'model'
    | 'layout'
    | 'labelAlign'
    | 'disabled'
    | 'rules'
    | 'autoLabelWidth'
    | 'id'
    | 'scrollToFirstError'
    | 'size'
  > {
  model: Recordable
  controlled: boolean
  schemas: AbFormSchema[]
  stepValue: number | null
  disabled: boolean
  disabledStyles: AbFormDisabledStyles
  size: AbFormSize
  layout: AbFormLayout
  labelAlign: AbFormLabelAlign
  labelColProps?: Recordable
  wrapperColProps?: Recordable
  labelColStyle?: CSSProperties
  wrapperColStyle?: CSSProperties
  labelColFlex?: string | number
  designable: boolean
  designableDirectives?: AbFormDesignableDirectives
  designableColProps?: AbFormDesignableColProps
  excontext: Recordable
  schemaProps: AbFormSchemaProps
  showErrorNotice: boolean
  scrollRef: HTMLElement | null
  autoInitField: boolean
  imports: AbFormImportItem[]
  anchor: boolean
  anchorProps: Recordable
  anchorAffixStyle: CSSProperties
}

export interface AbFormSchemaProps {
  layoutProps?: AbFormLayoutProps
  formItemProps?: AbFormItemProps
  componentProps?: AbFormComponentProps
}

export interface AbFormLayoutProps {
  span?: number
  alone?: boolean
  colStyle?: CSSProperties | string
}

export type AbFormSchema =
  | AbFormStepSchema
  | AbFormContainerSchema
  | AbFormDecoratorSchema
  | AbFormInputSchema
  | AbFormCustomSchema

export interface AbFormStepSchema extends AbFormSchemaBase {
  key: string
  type: 'Step'
  step: number
  children: AbFormSchema[]
  label?: AbFormSchemaFn<string> | string
  hidden?: AbFormSchemaFn<boolean> | boolean
  field?: never
  value?: never
  component?: never
  render?: never
  componentProps?: never
  componentEvent?: never
  formItemProps?: never
  layoutProps?: never
  outsideProps?: never
  insideProps?: never
}

export interface AbFormContainerSchema extends AbFormSchemaBase {
  key: string
  type: 'Container'
  component: AbFormContainerName | string
  children: AbFormSchema[]
  label?: AbFormSchemaFn<string> | string
  hidden?: AbFormSchemaFn<boolean> | boolean
  insideProps?: AbFormInsideProps
  componentProps?: AbFormComponentProps
  layoutProps?: AbFormLayoutProps
  anchorLinkProps?: AbFormAnchorLinkProps
  field?: never
  step?: never
  value?: never
  render?: never
  componentEvent?: never
  formItemProps?: never
  outsideProps?: never
}

export interface AbFormDecoratorSchema extends AbFormSchemaBase {
  key: string
  type: 'Decorator'
  component: AbFormDecoratorName | string
  label?: AbFormSchemaFn<string> | string
  hidden?: AbFormSchemaFn<boolean> | boolean
  componentProps?: AbFormComponentProps
  componentEvent?: AbFormComponentEvents
  layoutProps?: AbFormLayoutProps
  outsideProps?: AbFormOutsideProps
  insideProps?: AbFormInsideProps
  anchorLinkProps?: AbFormAnchorLinkProps
  field?: never
  step?: never
  value?: never
  children?: never
  render?: never
  formItemProps?: never
}

export interface AbFormInputSchema extends AbFormSchemaBase {
  field: string
  component: AbFormInputName | string
  key?: string
  type?: 'Inputer'
  label?: AbFormSchemaFn<string> | string
  hidden?: AbFormSchemaFn<boolean> | boolean
  value?: AbFormSchemaFn<any> | any
  componentProps?: AbFormComponentProps
  componentEvent?: AbFormComponentEvents
  formItemProps?: AbFormItemProps
  layoutProps?: AbFormLayoutProps
  outsideProps?: AbFormOutsideProps
  insideProps?: AbFormInsideProps
  step?: never
  children?: never
  render?: never
  anchorLinkProps?: never
}

export interface AbFormCustomSchema extends AbFormSchemaBase {
  field: string
  type: 'Custom'
  key?: string
  label?: AbFormSchemaFn<string> | string
  hidden?: AbFormSchemaFn<boolean> | boolean
  value?: AbFormSchemaFn<any> | any
  render?: AbFormSchemaDomFn<VNode>
  formItemProps?: AbFormItemProps
  layoutProps?: AbFormLayoutProps
  step?: never
  component?: never
  children?: never
  componentProps?: never
  componentEvent?: never
  outsideProps?: never
  insideProps?: never
  anchorLinkProps?: never
}

export interface AbFormSchemaBase {
  key?: string
  field?: string
  type?: AbFormSchemaType
  step?: number
  label?: AbFormSchemaFn<string> | string
  hidden?: AbFormSchemaFn<boolean> | boolean
  value?: AbFormSchemaFn<any> | any
  children?: AbFormSchema[]
  component?: AbFormComponentName
  render?: AbFormSchemaDomFn<VNode>
  componentProps?: AbFormComponentProps
  componentEvent?: AbFormComponentEvents
  formItemProps?: AbFormItemProps
  layoutProps?: AbFormLayoutProps
  outsideProps?: AbFormOutsideProps
  insideProps?: AbFormInsideProps
  anchorLinkProps?: AbFormAnchorLinkProps
}

export type AbFormSchemaType = 'Step' | 'Container' | 'Decorator' | 'Custom' | 'Inputer'

export type AbFormSchemaFn<T> = (
  form: Recordable,
  schema: AbFormSchema,
  disabled: boolean,
  excontext: Recordable
) => T

export type AbFormSchemaDomFn<T> = (
  form: Recordable,
  schema: AbFormSchema,
  disabled: boolean,
  excontext: Recordable,
  ...args: any[]
) => T

export type AbFormComponentName = AbFormContainerName | AbFormDecoratorName | AbFormInputName | string
export type AbFormContainerName = 'Group' | 'Blank' | 'Disclosure'
export type AbFormDecoratorName = 'Divider' | 'Alert' | 'Image' | 'Result' | 'Text'
export type AbFormInputName =
  | 'AutoComplete'
  | 'Cascader'
  | 'CheckboxGroup'
  | 'ColorPicker'
  | 'ComboInput'
  | 'DatePicker'
  | 'RangePicker'
  | 'Input'
  | 'InputNumber'
  | 'InputTag'
  | 'Mention'
  | 'RadioGroup'
  | 'Rate'
  | 'Select'
  | 'Slider'
  | 'Switch'
  | 'Table'
  | 'TimePicker'
  | 'Transfer'
  | 'TreeSelect'
  | 'Textarea'
  | 'Upload'
  | 'VerificationCode'

export type AbFormAnyComponentProps = {
  [K in `_v_${string}`]?: AbFormSchemaFn<any>
}

export interface AbFormComponentProps extends AbFormAnyComponentProps {
  freshKey?: string | number
  disabled?: AbFormSchemaFn<boolean> | boolean
  allowClear?: boolean
  options?: any[] | AbFormSchemaFn<any[]>
  fieldNames?: AbFormFieldNames
  style?: CSSProperties | string
  placeholder?: string | string[]
  vBinds?: Recordable<string, string>
  [key: string]: any
}

export type AbFormItemProps = Omit<
  ArcoFormItemPublicProps,
  'field' | 'label' | 'disabled' | 'rules' | 'help' | 'extra'
> & {
  noLabel?: AbFormSchemaFn<boolean> | boolean
  extra?: string
  help?: string
  extraRender?: AbFormSchemaDomFn<VNodeChild | false>
  helpRender?: AbFormSchemaDomFn<VNodeChild | false>
  layout?: AbFormLayout
  labelAlign?: AbFormLabelAlign
  rules?: FieldRule | FieldRule[]
  autoRules?: AutoRules[]
  addClass?: string | string[]
  style?: CSSProperties | string
}

export interface AbFormOutsideProps {
  enable?: boolean
  direction?: 'row' | 'column'
  style?: CSSProperties
  prependSlot?: AbFormSchemaFn<boolean> | boolean
  appendSlot?: AbFormSchemaFn<boolean> | boolean
  prependRender?: AbFormSchemaDomFn<VNodeChild | false>
  appendRender?: AbFormSchemaDomFn<VNodeChild | false>
}

export interface AbFormInsideProps {
  slots?: Record<string, AbFormSchemaFn<boolean> | boolean>
  renders?: Record<string, AbFormSchemaDomFn<VNodeChild | false> | string | false>
}

export interface AbFormAnchorLinkProps {
  enable?: boolean
  title?: string
  href?: string
}

export interface AbFormComponentEvents {
  onChange?: AbFormComponentEventFn<any>
  onClear?: AbFormComponentEventFn<void>
  onBlur?: AbFormComponentEventFn<FocusEvent>
  onFocus?: AbFormComponentEventFn<FocusEvent>
  [key: string]: AbFormComponentEventFn<any>
}

export type AbFormComponentEventFn<T> = (
  event: T,
  form: Recordable,
  schema: AbFormSchema,
  disabled: boolean,
  excontext: Recordable
) => void

export type AbFormFieldNames = {
  label?: string
  value?: string
  children?: string
  disabled?: string
}

export interface AbFormImportItemConfig {
  modelValueKey?: string
  needAllowClear?: boolean
  needInputPlaceholder?: boolean
  needSelectPlaceholder?: boolean
  needOptions?: boolean
  optionsPropName?: 'options' | 'data'
}

export interface AbFormImportItem {
  name: string
  component: Component
  config?: AbFormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}

export interface AbFormExpose {
  initValues: (initModel?: Recordable) => void
  getDefaultModel: (defaultModel?: Recordable) => Recordable
  getFormModel: () => Recordable
  getFormRef: () => AbFormRawInstance | undefined
  setValues: (data?: Recordable) => void
  clearValues: (defaultModel?: Recordable) => void
  setValue: (key: string, value: any) => void
  delValue: (key: string) => boolean
  validate: () => Promise<boolean>
  resetValidate: () => void
  scrollToKey: (key: string) => void
}

export type AbFormRawInstance = ArcoFormInstance
export type AbFormDesignableDirectives = {
  baseRow?: Recordable
  containerRow?: Recordable
}
export type AbFormDesignableColProps = (
  key: string,
  schema: AbFormSchema,
  isHidden: boolean
) => Recordable
