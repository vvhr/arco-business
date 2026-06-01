import type { PropType } from 'vue'
import type {
  AbFormDesignableColProps,
  AbFormDesignableDirectives,
  AbFormImportItem,
  AbFormLabelAlign,
  AbFormLayout,
  AbFormProps,
  AbFormSchema,
  AbFormSchemaProps,
  AbFormSize
} from './types'

type AbFormRuntimePropKey = keyof Pick<
  AbFormProps,
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

type AbFormRuntimeProps = Record<AbFormRuntimePropKey, any> & Partial<Record<keyof AbFormProps, any>>

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
    type: Array as PropType<AbFormSchema[]>,
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
    type: Object as PropType<AbFormProps['disabledStyles']>,
    default: () => ({
      textColor: 'var(--color-text-1)',
      borderColor: 'rgb(var(--arcoblue-6))',
      bgColor: 'transparent',
      noPadding: false,
      defaultCursor: false,
      noSuffix: false
    })
  },
  size: {
    type: String as PropType<AbFormSize>,
    default: 'medium'
  },
  layout: {
    type: String as PropType<AbFormLayout>,
    default: 'horizontal'
  },
  labelAlign: {
    type: String as PropType<AbFormLabelAlign>,
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
    type: Object as PropType<AbFormProps['labelColStyle']>,
    default: undefined
  },
  wrapperColStyle: {
    type: Object as PropType<AbFormProps['wrapperColStyle']>,
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
    type: Object as PropType<AbFormDesignableDirectives>,
    default: () => ({})
  },
  designableColProps: {
    type: Function as PropType<AbFormDesignableColProps>,
    default: () => ({})
  },
  excontext: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  schemaProps: {
    type: Object as PropType<AbFormSchemaProps>,
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
    type: Array as PropType<AbFormImportItem[]>,
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
    type: Object as PropType<AbFormProps['anchorAffixStyle']>,
    default: () => ({})
  }
} satisfies AbFormRuntimeProps
