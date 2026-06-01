import { defineComponent, type Component, type ComputedRef, type Ref, type VNodeChild } from 'vue'
import { get } from 'lodash-es'
import { getSlot } from '@/utils/get'
import { isExistAttr, isFunction } from '@/utils/is'
import { setReactiveValue } from '@/utils/set'
import { logger } from '@/locale'
import {
  needAllowClear,
  needDataOptions,
  needInputPlaceholder,
  needOptions,
  needRangePlaceholder,
  needSelectPlaceholder,
  SchemaType
} from '../constants'
import {
  getComponentEventFunction,
  getSchemaPropValue,
  getSlotKey,
  getFieldName
} from '../utils'
import type {
  AbFormComponentName,
  AbFormComponentProps,
  AbFormEmits,
  AbFormImportItemConfig,
  AbFormInputName,
  AbFormProps,
  AbFormSchema,
  AbFormSlots
} from '../types'

export function useComponent(
  props: AbFormProps,
  slots: AbFormSlots,
  emits: AbFormEmits,
  schema: AbFormSchema,
  formModel: Ref<Recordable>,
  componentProps: AbFormComponentProps,
  components: Partial<Recordable<Component, AbFormComponentName>>,
  componentConfigs: Partial<Recordable<AbFormImportItemConfig, AbFormComponentName>>,
  disabled?: ComputedRef<boolean>
) {
  const type = schema.type ?? SchemaType.INPUTER
  const slotKey = getSlotKey(schema)
  const freshKey = `${slotKey}-${schema.componentProps?.freshKey || 0}`
  const enableOutside = [SchemaType.INPUTER, SchemaType.DECORATOR].includes(type as any)
    ? (schema.outsideProps?.enable ?? false)
    : false

  function getAnyComponent() {
    if ([SchemaType.CONTAINER, SchemaType.INPUTER, SchemaType.DECORATOR].includes(type as any)) {
      if (isExistAttr(components, schema?.component || 'Input')) {
        return components[schema.component || 'Input'] as ReturnType<typeof defineComponent>
      }
    }
    return undefined
  }

  function setModelValue() {
    const bindings: Recordable = {}
    if (schema.field) {
      const modelValueKey = isExistAttr(components, schema.component)
        ? componentConfigs[schema.component]?.modelValueKey || 'modelValue'
        : 'modelValue'
      bindings[modelValueKey] = get(formModel.value, schema.field)
      bindings[`onUpdate:${modelValueKey}`] = (value: any) => {
        const oldValue = get(formModel.value, schema.field)
        setReactiveValue(formModel.value, schema.field, value)
        emits('change', { value, field: schema.field, oldValue })
      }
    }
    if (schema.field && schema.componentProps?.vBinds) {
      Object.entries(schema.componentProps.vBinds).forEach(([propName, fieldPath]) => {
        if (!propName || !fieldPath) {
          return
        }
        bindings[propName] = get(formModel.value, fieldPath)
        bindings[`onUpdate:${propName}`] = (value: any) => {
          const oldValue = get(formModel.value, fieldPath)
          setReactiveValue(formModel.value, fieldPath, value)
          emits('change', { value, field: schema.field!, oldValue })
        }
      })
    }
    return bindings
  }

  function setComponentProps(): Recordable {
    if (type === SchemaType.INPUTER) {
      const compProps: Recordable = {
        ...getAllowClear(schema, props, componentConfigs),
        ...getPlaceholder(schema, props, componentConfigs),
        ...setCascaderProps(schema),
        ...setTableProps(schema, formModel.value, props, disabled?.value),
        ...(componentProps || {}),
        ...setAttrsOptions(schema, componentProps, formModel.value, props, componentConfigs),
        ...setSegmentedProps(schema)
      }
      delete compProps.vBinds
      return compProps
    }
    if (type === SchemaType.CONTAINER) {
      return {
        label: schema.label || '',
        extra: schema.formItemProps?.extra || '',
        ...(componentProps || {})
      }
    }
    if (type === SchemaType.DECORATOR) {
      return {
        ...(componentProps || {})
      }
    }
    return {}
  }

  function setComponentEvent(): Recordable {
    if (!schema.componentEvent) {
      return {}
    }
    const compEvents: Recordable = {}
    Object.keys(schema.componentEvent).forEach(eventName => {
      const eventFn = schema.componentEvent?.[eventName]
      if (isFunction(eventFn)) {
        compEvents[eventName] = getComponentEventFunction(
          eventFn,
          formModel.value,
          schema,
          props.disabled,
          props.excontext
        )
      }
    })
    return compEvents
  }

  function setOutsidePrepend(): VNodeChild | undefined {
    if (!schema.outsideProps?.enable) {
      return undefined
    }
    if (isFunction(schema.outsideProps.prependRender) && !schema.outsideProps.prependSlot) {
      return schema.outsideProps.prependRender(
        formModel.value,
        schema,
        props.disabled,
        props.excontext
      ) || undefined
    }
    const enableSlot = getSchemaPropValue(
      schema.outsideProps.prependSlot,
      schema,
      formModel.value,
      props,
      'boolean',
      false
    )
    return enableSlot ? (getSlot(slots, `${slotKey}--out-prepend`, formModel.value) as any) : undefined
  }

  function setOutsideAppend(): VNodeChild | undefined {
    if (!schema.outsideProps?.enable) {
      return undefined
    }
    if (isFunction(schema.outsideProps.appendRender) && !schema.outsideProps.appendSlot) {
      return schema.outsideProps.appendRender(
        formModel.value,
        schema,
        props.disabled,
        props.excontext
      ) || undefined
    }
    const enableSlot = getSchemaPropValue(
      schema.outsideProps.appendSlot,
      schema,
      formModel.value,
      props,
      'boolean',
      false
    )
    return enableSlot ? (getSlot(slots, `${slotKey}--out-append`, formModel.value) as any) : undefined
  }

  return {
    getAnyComponent,
    setModelValue,
    setComponentProps,
    setComponentEvent,
    setOutsidePrepend,
    setOutsideAppend,
    freshKey,
    slotKey,
    enableOutside
  }
}

function setTableProps(
  schema: AbFormSchema,
  formModel: Recordable,
  props: AbFormProps,
  disabled?: boolean
) {
  if (schema.component !== 'Table') {
    return {}
  }
  return {
    excontext: props.excontext,
    form: formModel,
    editable: !disabled,
    adaptive: false
  }
}

function setCascaderProps(schema: AbFormSchema) {
  if (schema.component !== 'Cascader' || schema.componentProps?.pathMode !== undefined) {
    return {}
  }
  return {
    pathMode: true
  }
}

function setAttrsOptions(
  schema: AbFormSchema,
  componentProps: AbFormComponentProps,
  formModel: Recordable,
  props: AbFormProps,
  componentConfigs: Partial<Recordable<AbFormImportItemConfig, AbFormComponentName>>
) {
  if (!schema.component) {
    return {}
  }
  const component = componentConfigs[schema.component]
  const optionsPropName =
    component?.optionsPropName ||
    (needDataOptions.includes(schema.component as AbFormInputName) ? 'data' : 'options')
  if (
    needOptions.includes(schema.component as AbFormInputName) ||
    needDataOptions.includes(schema.component as AbFormInputName) ||
    component?.needOptions
  ) {
    if (!Reflect.has(componentProps, 'options')) {
      return {}
    }
    const fieldNames = {
      disabled: 'disabled',
      children: 'children',
      value: 'value',
      label: 'label',
      ...(componentProps?.fieldNames || {})
    }
    const options = isFunction(componentProps.options)
      ? componentProps.options(formModel, schema, props.disabled, props.excontext)
      : componentProps.options
    if (!Array.isArray(options)) {
      return {}
    }
    const nextProps: Recordable = {
      [optionsPropName]: options
    }
    if (schema.component !== 'Transfer') {
      nextProps.fieldNames = fieldNames
    }
    return nextProps
  }
  return {}
}

function setSegmentedProps(schema: AbFormSchema) {
  if (schema.component !== 'Segmented') {
    return {}
  }
  return {
    type: 'button'
  }
}

function getAllowClear(
  schema: AbFormSchema,
  props: AbFormProps,
  componentConfigs: Partial<Recordable<AbFormImportItemConfig, AbFormComponentName>>
) {
  const allowClear = props.schemaProps?.componentProps?.allowClear ?? true
  if (!allowClear) {
    return {}
  }
  const type = schema.type ?? SchemaType.INPUTER
  if (type === SchemaType.INPUTER && schema.component) {
    if (needAllowClear.includes(schema.component as AbFormInputName)) {
      return { allowClear: true }
    }
    if (componentConfigs[schema.component]?.needAllowClear) {
      return { allowClear: true }
    }
  }
  return {}
}

function getPlaceholder(
  schema: AbFormSchema,
  props: AbFormProps,
  componentConfigs: Partial<Recordable<AbFormImportItemConfig, AbFormComponentName>>
) {
  const autoPlaceholder = props.schemaProps?.componentProps?.autoPlaceholder ?? true
  const setPlaceholderInDisabled = props.schemaProps?.componentProps?.setPlaceholderInDisabled
  if (!autoPlaceholder && !(props.disabled && setPlaceholderInDisabled !== undefined)) {
    return {}
  }
  const type = schema.type ?? SchemaType.INPUTER
  if (type !== SchemaType.INPUTER) {
    return {}
  }
  const labelStr = typeof schema.label === 'string' ? schema.label : ''
  const component = componentConfigs[schema.component]
  const schemaComponentProps = schema.componentProps || {}
  if (needInputPlaceholder.includes(schema.component as AbFormInputName) || component?.needInputPlaceholder) {
    return {
      placeholder: props.disabled && setPlaceholderInDisabled !== undefined
        ? setPlaceholderInDisabled
        : labelStr ? `请填写${labelStr}` : ''
    }
  }
  if (needSelectPlaceholder.includes(schema.component as AbFormInputName) || component?.needSelectPlaceholder) {
    if (props.disabled && setPlaceholderInDisabled !== undefined) {
      if (schema.component === 'TimePicker' && schemaComponentProps.type === 'time-range') {
        return {
          placeholder: [setPlaceholderInDisabled, setPlaceholderInDisabled]
        }
      }
      return {
        placeholder: setPlaceholderInDisabled
      }
    }
    if (schema.component === 'TimePicker' && schemaComponentProps.type === 'time-range') {
      const timeRangePlaceholder = labelStr ? `请选择${labelStr}` : ''
      return {
        placeholder: [timeRangePlaceholder, timeRangePlaceholder]
      }
    }
    return {
      placeholder: labelStr ? `请选择${labelStr}` : ''
    }
  }
  if (needRangePlaceholder.includes(schema.component as AbFormInputName)) {
    const rangePlaceholder = props.disabled && setPlaceholderInDisabled !== undefined
      ? setPlaceholderInDisabled
      : labelStr ? `请选择${labelStr}` : ''
    return {
      placeholder: [rangePlaceholder, rangePlaceholder]
    }
  }
  return {}
}
