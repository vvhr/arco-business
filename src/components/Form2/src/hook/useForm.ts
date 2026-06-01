import { computed, ref, toRaw, unref, type Component, type Ref } from 'vue'
import { get, set, unset } from 'lodash-es'
import { Message } from '@arco-design/web-vue'
import { findNode, findNodes } from '@/utils/tree'
import { t } from '@/locale'
import { SchemaType } from '../constants'
import { getTrueComponentProps, getValue, isHidden } from '../utils'
import type {
  AbFormComponentName,
  AbFormEmits,
  AbFormProps,
  AbFormRawInstance,
  AbFormSchema,
  AbFormValidationErrors
} from '../types'

type AbFormUseFormReturn = {
  isValidating: Ref<boolean>
  formModel: Ref<Recordable>
  formRef: Ref<AbFormRawInstance | undefined>
  baseRowRef: Ref<any>
  componentRefs: Ref<Recordable<ComponentRef<any>>>
  initValues: (initModel?: Recordable) => void
  getDefaultModel: (defaultModel?: Recordable) => Recordable
  getFormModel: () => Recordable
  getFormRef: () => AbFormRawInstance | undefined
  setValues: (data?: Recordable) => void
  clearValues: (defaultModel?: Recordable) => void
  setValue: (path: string, value: any) => void
  delValue: (path: string) => boolean
  resetValidate: () => void
  validate: () => Promise<boolean>
  scrollToKey: (key: string) => void
}

export function useForm(
  props: AbFormProps,
  emit: AbFormEmits,
  components: Recordable<Component, AbFormComponentName>,
  arrayStrategies: Partial<Record<AbFormComponentName, (cps: Recordable) => boolean>>
): AbFormUseFormReturn {
  const isValidating = ref(false)
  const formModel = props.controlled
    ? computed({
        get: () => props.model,
        set: value => emit('update:model', value)
      })
    : ref<Recordable>({})

  const formRef = ref<AbFormRawInstance>()
  const baseRowRef = ref<any>()
  const componentRefs = ref<Recordable<ComponentRef<any>>>({})

  function initValues(initModel?: Recordable) {
    formModel.value = {
      ...getDefaultModel(initModel || {}),
      ...initModel
    }
    window.setTimeout(() => resetValidate(), 200)
  }

  function getDefaultModel(defaultModel?: Recordable) {
    const model: Recordable = { ...(defaultModel || {}) }
    const initField = (schema: AbFormSchema) => {
      const type = schema.type ?? SchemaType.INPUTER
      if (!schema.field || (type !== SchemaType.CUSTOM && type !== SchemaType.INPUTER)) {
        if (
          [SchemaType.STEP, SchemaType.CONTAINER].includes(type as any) &&
          schema.children &&
          Array.isArray(schema.children)
        ) {
          schema.children.forEach(child => initField(child))
        }
        return
      }
      if (get(model, schema.field) !== undefined) {
        return
      }
      if (schema.value !== undefined) {
        set(model, schema.field, getValue(schema, model, props))
        return
      }
      const componentName = schema.component as AbFormComponentName
      if (componentName && arrayStrategies[componentName]) {
        const componentProps = getTrueComponentProps(schema, model, props)
        const shouldBeArray = arrayStrategies[componentName]?.(componentProps)
        set(model, schema.field, shouldBeArray ? [] : null)
        return
      }
      set(model, schema.field, null)
    }
    props.schemas.forEach(schema => initField(schema))
    return model
  }

  function getFormModel() {
    return formModel.value
  }

  function getFormRef() {
    return unref(formRef)
  }

  function setValues(data: Recordable = {}) {
    formModel.value = { ...unref(formModel), ...data }
  }

  function clearValues(defaultModel?: Recordable) {
    formModel.value = { ...(defaultModel || getDefaultModel()) }
    window.setTimeout(() => resetValidate(), 200)
  }

  function setValue(path: string, value: any) {
    if (props.controlled) {
      const nextModel = { ...props.model }
      set(nextModel, path, value)
      formModel.value = nextModel
      return
    }
    set(formModel.value, path, value)
  }

  function delValue(path: string) {
    if (get(unref(formModel), path) === undefined) {
      return false
    }
    if (props.controlled) {
      const nextModel = { ...props.model }
      unset(nextModel, path)
      formModel.value = nextModel
    } else {
      unset(formModel.value, path)
    }
    return true
  }

  function resetValidate() {
    unref(formRef)?.clearValidate?.()
    getVisibleTableSchemas().forEach(schema => {
      const tableRef = getComponentRef(schema.key || schema.field || '')
      tableRef?.resetValidate?.()
    })
  }

  const getComponentRef = (key: string) => {
    return key ? componentRefs.value[`${key}Ref`] : undefined
  }

  const getVisibleTableSchemas = () => {
    const rawSchemas = toRaw(props.schemas)
    return findNodes(rawSchemas, (node: AbFormSchema) => {
      return node.component === 'Table' && !isHidden(node, formModel.value, props)
    }) as AbFormSchema[]
  }

  const validateTables = async () => {
    for (const schema of getVisibleTableSchemas()) {
      const tableRef = getComponentRef(schema.key || schema.field || '')
      if (tableRef) {
        const valid = await tableRef.validate?.()
        if (valid === false) {
          const fieldLabel = schema.label || schema.field
          if (fieldLabel && props.showErrorNotice) {
            Message.warning(t('form.validation.tableError', { field: fieldLabel }))
          }
          return false
        }
      }
    }
    return true
  }

  function handleValidationError(errors: AbFormValidationErrors | undefined) {
    if (!errors) {
      return
    }
    const firstError = Object.values(errors)[0]
    if (!firstError) {
      return
    }
    const findSchema = findNode(props.schemas, schema => schema.field === firstError.field)
    if (props.scrollRef && findSchema) {
      scrollToKey(findSchema.key || findSchema.field || '')
    }
    if (props.showErrorNotice && findSchema) {
      const fieldLabel = findSchema.label || findSchema.field
      if (fieldLabel) {
        Message.warning(`${t('form.validation.fieldError', { field: fieldLabel })}: ${firstError.message}`)
      }
    }
  }

  async function validate() {
    isValidating.value = true
    try {
      const errors = await unref(formRef)?.validate?.()
      handleValidationError(errors as AbFormValidationErrors | undefined)
      const tableResult = await validateTables()
      return !errors && tableResult
    } catch (error) {
      console.error('[AbForm] validate error', error)
      return false
    } finally {
      isValidating.value = false
    }
  }

  function scrollToKey(key: string) {
    if (!props.scrollRef || !key) {
      return
    }
    const element = props.scrollRef.querySelector(`[data-id="${CSS.escape(key)}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return {
    isValidating,
    formModel,
    formRef,
    baseRowRef,
    componentRefs,
    initValues,
    getDefaultModel,
    getFormModel,
    getFormRef,
    setValues,
    clearValues,
    setValue,
    delValue,
    resetValidate,
    validate,
    scrollToKey
  }
}
