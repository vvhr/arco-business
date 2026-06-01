import FormComponent from './src/AbForm.vue'
import { withInstall } from '@/utils/install'
import type { SFCWithInstall } from '@/utils/install'
import type { DefineComponent } from 'vue'
import type { FormExpose, FormProps } from './src/types.ts'

type FormPublicProps = Partial<Omit<FormProps, 'onChange'>> & {
  onRegister?: (formRef: any) => any
  onInit?: (form: Recordable) => any
  onChange?: (data: { value: any; field: string; oldValue: any }) => any
}

type FormPublicComponent = DefineComponent<FormPublicProps>

export const AbForm: SFCWithInstall<FormPublicComponent> = withInstall(
  FormComponent as unknown as FormPublicComponent
)
export default AbForm

export type FormDefineProps = FormPublicProps
export type FormInstance = InstanceType<FormPublicComponent> & FormExpose
export type {
  FormAnchorLinkProps,
  FormAnyComponentProps,
  FormComponentEventFn,
  FormComponentEvents,
  FormComponentName,
  FormComponentProps,
  FormContainerName,
  FormContainerSchema,
  FormCustomSchema,
  FormDecoratorName,
  FormDecoratorSchema,
  FormDesignableColProps,
  FormDesignableDirectives,
  FormDisabledStyles,
  FormEmits,
  FormExpose,
  FormFieldNames,
  FormImportItem,
  FormImportItemConfig,
  FormInputName,
  FormInputSchema,
  FormItemProps,
  FormLabelAlign,
  FormLayout,
  FormLayoutProps,
  FormOutsideProps,
  FormProps,
  FormRawInstance,
  FormSchema,
  FormSchemaBase,
  FormSchemaDomFn,
  FormSchemaFn,
  FormSchemaProps,
  FormSchemaType,
  FormSize,
  FormSlots,
  FormStepSchema,
  FormValidationErrors
} from './src/types.ts'
