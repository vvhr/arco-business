import { defineComponent, type Component, type ComputedRef, type Ref, type VNodeChild } from 'vue'
import { get } from 'lodash-es'
import { getSlot } from '@/utils/get'
import { isExistAttr, isFunction } from '@/utils/is'
import { setReactiveValue } from '@/utils/set'
import { logger, t } from '@/locale'
import { getPlaceholder as getLocalePlaceholder } from '@/locale/utils'
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
  FormComponentName,
  FormComponentProps,
  FormEmits,
  FormImportItemConfig,
  FormInputName,
  FormProps,
  FormSchema,
  FormSlots
} from '../types'

export function useComponent(
  props: FormProps,
  slots: FormSlots,
  emits: FormEmits,
  schema: FormSchema,
  formModel: Ref<Recordable>,
  componentProps: FormComponentProps,
  components: Partial<Recordable<Component, FormComponentName>>,
  componentConfigs: Partial<Recordable<FormImportItemConfig, FormComponentName>>,
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
  schema: FormSchema,
  formModel: Recordable,
  props: FormProps,
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

function setCascaderProps(schema: FormSchema) {
  if (schema.component !== 'Cascader' || schema.componentProps?.pathMode !== undefined) {
    return {}
  }
  return {
    pathMode: true
  }
}

function setAttrsOptions(
  schema: FormSchema,
  componentProps: FormComponentProps,
  formModel: Recordable,
  props: FormProps,
  componentConfigs: Partial<Recordable<FormImportItemConfig, FormComponentName>>
) {
  if (!schema.component) {
    return {}
  }
  const component = componentConfigs[schema.component]
  const optionsPropName =
    component?.optionsPropName ||
    (needDataOptions.includes(schema.component as FormInputName) ? 'data' : 'options')
  if (
    needOptions.includes(schema.component as FormInputName) ||
    needDataOptions.includes(schema.component as FormInputName) ||
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

function setSegmentedProps(schema: FormSchema) {
  if (schema.component !== 'Segmented') {
    return {}
  }
  return {
    type: 'button'
  }
}

function getAllowClear(
  schema: FormSchema,
  props: FormProps,
  componentConfigs: Partial<Recordable<FormImportItemConfig, FormComponentName>>
) {
  const allowClear = props.schemaProps?.componentProps?.allowClear ?? true
  if (!allowClear) {
    return {}
  }
  const type = schema.type ?? SchemaType.INPUTER
  if (type === SchemaType.INPUTER && schema.component) {
    if (needAllowClear.includes(schema.component as FormInputName)) {
      return { allowClear: true }
    }
    if (componentConfigs[schema.component]?.needAllowClear) {
      return { allowClear: true }
    }
  }
  return {}
}

function getPlaceholder(
  schema: FormSchema,
  props: FormProps,
  componentConfigs: Partial<Recordable<FormImportItemConfig, FormComponentName>>
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
  if (needInputPlaceholder.includes(schema.component as FormInputName) || component?.needInputPlaceholder) {
    const inputPlaceholder = labelStr ? getLocalePlaceholder(t('form.placeholder.input'), labelStr) : ''
    return {
      placeholder: props.disabled && setPlaceholderInDisabled !== undefined
        ? setPlaceholderInDisabled
        : inputPlaceholder
    }
  }
  if (needSelectPlaceholder.includes(schema.component as FormInputName) || component?.needSelectPlaceholder) {
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
      const timeRangePlaceholder = labelStr ? getLocalePlaceholder(t('form.placeholder.select'), labelStr) : ''
      return {
        placeholder: [timeRangePlaceholder, timeRangePlaceholder]
      }
    }
    const selectPlaceholder = labelStr ? getLocalePlaceholder(t('form.placeholder.select'), labelStr) : ''
    return {
      placeholder: selectPlaceholder
    }
  }
  if (needRangePlaceholder.includes(schema.component as FormInputName)) {
    const rangePlaceholder = props.disabled && setPlaceholderInDisabled !== undefined
      ? setPlaceholderInDisabled
      : labelStr ? getLocalePlaceholder(t('form.placeholder.select'), labelStr) : ''
    return {
      placeholder: [rangePlaceholder, rangePlaceholder]
    }
  }
  return {}
}
