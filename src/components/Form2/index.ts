import AbFormComponent from './src/AbForm.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'
import type { DefineComponent } from 'vue'
import type { AbFormExpose, AbFormProps } from './src/types'

type AbFormPublicProps = Partial<Omit<AbFormProps, 'onChange'>> & {
  onRegister?: (formRef: any) => any
  onInit?: (form: Recordable) => any
  onChange?: (data: { value: any; field: string; oldValue: any }) => any
}

type AbFormPublicComponent = DefineComponent<AbFormPublicProps>

export const AbForm: SFCWithInstall<AbFormPublicComponent> = withInstall(
  AbFormComponent as unknown as AbFormPublicComponent
)
export default AbForm

export type AbFormDefineProps = AbFormPublicProps
export type AbFormInstance = InstanceType<AbFormPublicComponent> & AbFormExpose
export type {
  AbFormAnchorLinkProps,
  AbFormAnyComponentProps,
  AbFormComponentEventFn,
  AbFormComponentEvents,
  AbFormComponentName,
  AbFormComponentProps,
  AbFormContainerName,
  AbFormContainerSchema,
  AbFormCustomSchema,
  AbFormDecoratorName,
  AbFormDecoratorSchema,
  AbFormDesignableColProps,
  AbFormDesignableDirectives,
  AbFormDisabledStyles,
  AbFormEmits,
  AbFormExpose,
  AbFormFieldNames,
  AbFormImportItem,
  AbFormImportItemConfig,
  AbFormInputName,
  AbFormInputSchema,
  AbFormItemProps,
  AbFormLabelAlign,
  AbFormLayout,
  AbFormLayoutProps,
  AbFormOutsideProps,
  AbFormProps,
  AbFormRawInstance,
  AbFormSchema,
  AbFormSchemaBase,
  AbFormSchemaDomFn,
  AbFormSchemaFn,
  AbFormSchemaProps,
  AbFormSchemaType,
  AbFormSize,
  AbFormSlots,
  AbFormStepSchema,
  AbFormValidationErrors
} from './src/types'
