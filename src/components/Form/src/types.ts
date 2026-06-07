import type {
  FieldRule,
  FormInstance as ArcoFormInstance,
  ValidatedError
} from '@arco-design/web-vue'
import type { Component, CSSProperties, Slots, VNode, VNodeChild } from 'vue'
import type { AutoRules } from '@/types/rules'

type ArcoFormPublicProps = InstanceType<(typeof import('@arco-design/web-vue'))['Form']>['$props']
type ArcoFormItemPublicProps = InstanceType<
  (typeof import('@arco-design/web-vue'))['FormItem']
>['$props']

export type FormSize = 'mini' | 'small' | 'medium' | 'large'
export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormLabelAlign = 'left' | 'right'
export type FormDisabledStyles = {
  textColor?: false | string
  borderColor?: false | string
  bgColor?: false | string
  itemMarginBottom?: false | string
  labelMarginBottom?: false | string
  labelFontSize?: false | string
  noPadding?: boolean
  defaultCursor?: boolean
  noSuffix?: boolean
  noRequiredSymbol?: boolean
}
export type FormValidationErrors = Record<string, ValidatedError>

export interface FormSlots extends Slots {
  [key: string]: (form: Recordable) => any
  [key: `${string}--label`]: () => any
  [key: `${string}--error`]: () => any
  [key: `${string}--extra`]: () => any
  [key: `${string}--help`]: () => any
  [key: `${string}--${string}`]: (data: { form: Recordable; [key: string]: any }) => any
  [key: `${string}--out-prepend`]: (form: Recordable) => any
  [key: `${string}--out-append`]: (form: Recordable) => any
  design?: (schema: FormSchema) => any
}

export interface FormEmits {
  (e: 'register', formRef: FormRawInstance | undefined): void
  (e: 'update:stepValue', stepValue: number | null): void
  (e: 'init', form: Recordable): void
  (e: 'change', data: { value: any; field: string; oldValue: any }): void
  (e: 'update:model', model: Recordable): void
}

export interface FormProps extends Omit<
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
  schemas: FormSchema[]
  stepValue: number | null
  disabled: boolean
  disabledStyles: FormDisabledStyles
  size: FormSize
  layout: FormLayout
  labelAlign: FormLabelAlign
  labelColProps?: Recordable
  wrapperColProps?: Recordable
  labelColStyle?: CSSProperties
  wrapperColStyle?: CSSProperties
  labelColFlex?: string | number
  designable: boolean
  designableDirectives?: FormDesignableDirectives
  designableColProps?: FormDesignableColProps
  excontext: Recordable
  schemaProps: FormSchemaProps
  showErrorNotice: boolean
  scrollRef: HTMLElement | null
  autoInitField: boolean
  imports: FormImportItem[]
  anchor: boolean
  anchorProps: Recordable
  anchorAffixStyle: CSSProperties
}

export interface FormSchemaProps {
  layoutProps?: FormLayoutProps
  formItemProps?: FormItemProps
  componentProps?: FormComponentProps
}

export interface FormLayoutProps {
  span?: number
  alone?: boolean
  colStyle?: CSSProperties | string
}

export type FormSchema =
  | FormStepSchema
  | FormContainerSchema
  | FormDecoratorSchema
  | FormInputSchema
  | FormCustomSchema

export interface FormStepSchema extends FormSchemaBase {
  key: string
  type: 'Step'
  step: number
  children: FormSchema[]
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
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

export interface FormContainerSchema extends FormSchemaBase {
  key: string
  type: 'Container'
  component: FormContainerName | string
  children: FormSchema[]
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  insideProps?: FormInsideProps
  componentProps?: FormComponentProps
  layoutProps?: FormLayoutProps
  anchorLinkProps?: FormAnchorLinkProps
  field?: never
  step?: never
  value?: never
  render?: never
  componentEvent?: never
  formItemProps?: never
  outsideProps?: never
}

export interface FormDecoratorSchema extends FormSchemaBase {
  key: string
  type: 'Decorator'
  component: FormDecoratorName | string
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  componentProps?: FormComponentProps
  componentEvent?: FormComponentEvents
  layoutProps?: FormLayoutProps
  outsideProps?: FormOutsideProps
  insideProps?: FormInsideProps
  anchorLinkProps?: FormAnchorLinkProps
  field?: never
  step?: never
  value?: never
  children?: never
  render?: never
  formItemProps?: never
}

export interface FormInputSchema extends FormSchemaBase {
  field: string
  component: FormInputName | string
  key?: string
  type?: 'Inputer'
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  value?: FormSchemaFn<any> | any
  componentProps?: FormComponentProps
  componentEvent?: FormComponentEvents
  formItemProps?: FormItemProps
  layoutProps?: FormLayoutProps
  outsideProps?: FormOutsideProps
  insideProps?: FormInsideProps
  step?: never
  children?: never
  render?: never
  anchorLinkProps?: never
}

export interface FormCustomSchema extends FormSchemaBase {
  field: string
  type: 'Custom'
  key?: string
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  value?: FormSchemaFn<any> | any
  render?: FormSchemaDomFn<VNode>
  formItemProps?: FormItemProps
  layoutProps?: FormLayoutProps
  step?: never
  component?: never
  children?: never
  componentProps?: never
  componentEvent?: never
  outsideProps?: never
  insideProps?: never
  anchorLinkProps?: never
}

export interface FormSchemaBase {
  key?: string
  field?: string
  type?: FormSchemaType
  step?: number
  label?: FormSchemaFn<string> | string
  hidden?: FormSchemaFn<boolean> | boolean
  value?: FormSchemaFn<any> | any
  children?: FormSchema[]
  component?: FormComponentName
  render?: FormSchemaDomFn<VNode>
  componentProps?: FormComponentProps
  componentEvent?: FormComponentEvents
  formItemProps?: FormItemProps
  layoutProps?: FormLayoutProps
  outsideProps?: FormOutsideProps
  insideProps?: FormInsideProps
  anchorLinkProps?: FormAnchorLinkProps
}

export type FormSchemaType = 'Step' | 'Container' | 'Decorator' | 'Custom' | 'Inputer'

export type FormSchemaFn<T> = (
  form: Recordable,
  schema: FormSchema,
  disabled: boolean,
  excontext: Recordable
) => T

export type FormSchemaDomFn<T> = (
  form: Recordable,
  schema: FormSchema,
  disabled: boolean,
  excontext: Recordable,
  ...args: any[]
) => T

export type FormComponentName = FormContainerName | FormDecoratorName | FormInputName | string
export type FormContainerName = 'Group' | 'Blank' | 'Disclosure'
export type FormDecoratorName = 'Divider' | 'Alert' | 'Image' | 'Result' | 'Text'
export type FormInputName =
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

export type FormAnyComponentProps = {
  [K in `_v_${string}`]?: FormSchemaFn<any>
}

export interface FormComponentProps extends FormAnyComponentProps {
  freshKey?: string | number
  disabled?: FormSchemaFn<boolean> | boolean
  allowClear?: boolean
  options?: any[] | FormSchemaFn<any[]>
  fieldNames?: FormFieldNames
  style?: CSSProperties | string
  placeholder?: string | string[]
  vBinds?: Recordable<string, string>
  [key: string]: any
}

export type FormItemProps = Omit<
  ArcoFormItemPublicProps,
  'field' | 'label' | 'disabled' | 'rules' | 'help' | 'extra'
> & {
  noLabel?: FormSchemaFn<boolean> | boolean
  extra?: string
  help?: string
  extraRender?: FormSchemaDomFn<VNodeChild | false>
  helpRender?: FormSchemaDomFn<VNodeChild | false>
  layout?: FormLayout
  labelAlign?: FormLabelAlign
  rules?: FieldRule | FieldRule[]
  autoRules?: AutoRules[]
  addClass?: string | string[]
  style?: CSSProperties | string
}

export interface FormOutsideProps {
  enable?: boolean
  direction?: 'row' | 'column'
  style?: CSSProperties
  prependSlot?: FormSchemaFn<boolean> | boolean
  appendSlot?: FormSchemaFn<boolean> | boolean
  prependRender?: FormSchemaDomFn<VNodeChild | false>
  appendRender?: FormSchemaDomFn<VNodeChild | false>
}

export interface FormInsideProps {
  slots?: Record<string, FormSchemaFn<boolean> | boolean>
  renders?: Record<string, FormSchemaDomFn<VNodeChild | false> | string | false>
}

export interface FormAnchorLinkProps {
  enable?: boolean
  title?: string
  href?: string
}

export interface FormComponentEvents {
  onChange?: FormComponentEventFn<any>
  onClear?: FormComponentEventFn<void>
  onBlur?: FormComponentEventFn<FocusEvent>
  onFocus?: FormComponentEventFn<FocusEvent>
  [key: string]: FormComponentEventFn<any>
}

export type FormComponentEventFn<T> = (
  event: T,
  form: Recordable,
  schema: FormSchema,
  disabled: boolean,
  excontext: Recordable
) => void

export type FormFieldNames = {
  label?: string
  value?: string
  children?: string
  disabled?: string
}

export interface FormImportItemConfig {
  modelValueKey?: string
  needAllowClear?: boolean
  needInputPlaceholder?: boolean
  needSelectPlaceholder?: boolean
  needOptions?: boolean
  optionsPropName?: 'options' | 'data'
}

export interface FormImportItem {
  name: string
  component: Component
  config?: FormImportItemConfig
  isArrayFn?: (cps: Recordable) => boolean
}

export interface FormExpose {
  initValues: (initModel?: Recordable) => void
  getDefaultModel: (defaultModel?: Recordable) => Recordable
  getFormModel: () => Recordable
  getFormRef: () => FormRawInstance | undefined
  setValues: (data?: Recordable) => void
  clearValues: (defaultModel?: Recordable) => void
  setValue: (key: string, value: any) => void
  delValue: (key: string) => boolean
  validate: () => Promise<boolean>
  resetValidate: () => void
  scrollToKey: (key: string) => void
}

export type FormRawInstance = ArcoFormInstance
export type FormDesignableDirectives = {
  baseRow?: Recordable
  containerRow?: Recordable
}
export type FormDesignableColProps = (
  key: string,
  schema: FormSchema,
  isHidden: boolean
) => Recordable
