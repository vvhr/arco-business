import type { PropType } from 'vue'
import type {
  FormDesignableColProps,
  FormDesignableDirectives,
  FormImportItem,
  FormLabelAlign,
  FormLayout,
  FormProps,
  FormSchema,
  FormSchemaProps,
  FormSize
} from './types'

type FormRuntimePropKey = keyof Pick<
  FormProps,
  | 'model'
  | 'controlled'
  | 'schemas'
  | 'stepValue'
  | 'disabled'
  | 'disabledStyles'
  | 'size'
  | 'layout'
  | 'labelAlign'
  | 'labelColProps'
  | 'wrapperColProps'
  | 'labelColStyle'
  | 'wrapperColStyle'
  | 'labelColFlex'
  | 'designable'
  | 'designableDirectives'
  | 'designableColProps'
  | 'excontext'
  | 'schemaProps'
  | 'showErrorNotice'
  | 'scrollRef'
  | 'autoInitField'
  | 'imports'
  | 'anchor'
  | 'anchorProps'
  | 'anchorAffixStyle'
>

type FormRuntimeProps = Record<FormRuntimePropKey, any> & Partial<Record<keyof FormProps, any>>

export const abFormProps = {
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  controlled: {
    type: Boolean,
    default: false
  },
  schemas: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  stepValue: {
    type: [Number, null] as unknown as PropType<number | null>,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disabledStyles: {
    type: Object as PropType<FormProps['disabledStyles']>,
    default: () => ({
      textColor: 'var(--color-text-1)',
      borderColor: 'rgb(var(--arcoblue-6))',
      bgColor: 'transparent',
      itemMarginBottom: '0px',
      labelFontSize: false as false,
      noPadding: false,
      defaultCursor: false,
      noSuffix: false
    })
  },
  size: {
    type: String as PropType<FormSize>,
    default: 'medium'
  },
  layout: {
    type: String as PropType<FormLayout>,
    default: 'horizontal'
  },
  labelAlign: {
    type: String as PropType<FormLabelAlign>,
    default: 'right'
  },
  labelColProps: {
    type: Object as PropType<Recordable>,
    default: () => ({ span: 5 })
  },
  wrapperColProps: {
    type: Object as PropType<Recordable>,
    default: () => ({ span: 19 })
  },
  labelColStyle: {
    type: Object as PropType<FormProps['labelColStyle']>,
    default: undefined
  },
  wrapperColStyle: {
    type: Object as PropType<FormProps['wrapperColStyle']>,
    default: undefined
  },
  labelColFlex: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  designable: {
    type: Boolean,
    default: false
  },
  designableDirectives: {
    type: Object as PropType<FormDesignableDirectives>,
    default: () => ({})
  },
  designableColProps: {
    type: Function as PropType<FormDesignableColProps>,
    default: () => ({})
  },
  excontext: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  schemaProps: {
    type: Object as PropType<FormSchemaProps>,
    default: () => ({})
  },
  showErrorNotice: {
    type: Boolean,
    default: true
  },
  scrollRef: {
    type: Object as PropType<HTMLElement | null>,
    default: null
  },
  autoInitField: {
    type: Boolean,
    default: true
  },
  imports: {
    type: Array as PropType<FormImportItem[]>,
    default: () => []
  },
  anchor: {
    type: Boolean,
    default: false
  },
  anchorProps: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  anchorAffixStyle: {
    type: Object as PropType<FormProps['anchorAffixStyle']>,
    default: () => ({})
  }
} satisfies FormRuntimeProps
