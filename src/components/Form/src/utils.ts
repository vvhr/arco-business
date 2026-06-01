import type { FormProps, FormSchema, FormComponentProps } from './types'
import { isFunction } from '@/utils/is'
import { logger } from '@/locale'

export function isHidden(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(schema.hidden, schema, formModel, props, 'boolean', false)
}

export function getValue(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(schema.value, schema, formModel, props, 'any', null)
}

export function getLabel(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(schema.label, schema, formModel, props, 'string', '')
}

export function getNoLabel(schema: FormSchema, formModel: Recordable, props: FormProps) {
  return getSchemaPropValue(
    schema.formItemProps?.noLabel,
    schema,
    formModel,
    props,
    'boolean',
    false
  )
}

export function getSchemaPropValue(
  propValue: any,
  schema: FormSchema,
  formModel: Recordable,
  props: FormProps,
  staticType: 'boolean' | 'string' | 'number' | 'array' | 'object' | 'any',
  def: any
) {
  if (propValue === undefined) {
    return def
  }
  if (typeof propValue === staticType && ['boolean', 'number', 'string'].includes(staticType)) {
    return propValue
  }
  if (staticType === 'array' && Array.isArray(propValue)) {
    return propValue
  }
  if (staticType === 'object' && typeof propValue === 'object') {
    return propValue
  }
  if (isFunction(propValue)) {
    return propValue(formModel, schema, props.disabled, props.excontext)
  }
  if (staticType === 'any') {
    return propValue
  }
  return def
}

export function getTrueComponentProps(
  schema: FormSchema,
  formModel: Recordable,
  props: FormProps
): Recordable {
  if (schema.type === 'Step') {
    return {}
  }
  if (!schema.componentProps || typeof schema.componentProps !== 'object') {
    return {}
  }
  const schemaProps = { ...schema.componentProps }
  const dynamicKeys = Object.keys(schemaProps).filter(key => key.startsWith('_v_'))
  dynamicKeys.forEach(key => {
    const trueKey = key.replace('_v_', '')
    if (!trueKey || !isFunction(schemaProps[key])) {
      return
    }
    try {
      schemaProps[trueKey] = schemaProps[key](formModel, schema, props.disabled, props.excontext)
    } catch (error) {
      logger.error('console.form.dynamicPropertyError', { key }, schema, error)
    } finally {
      delete schemaProps[key]
    }
  })
  return schemaProps
}

export function getComponentPropValue(
  truePropName: string,
  enableFn: boolean,
  schema: FormSchema,
  formModel: Recordable,
  trueComponentProps: FormComponentProps,
  props: FormProps,
  def: any
) {
  if (!schema.componentProps) {
    return def
  }
  if (trueComponentProps[truePropName] === undefined) {
    return def
  }
  const propValue = trueComponentProps[truePropName]
  if (enableFn && isFunction(propValue)) {
    return propValue(formModel, schema, props.disabled, props.excontext)
  }
  return propValue
}

export function getComponentEventFunction(
  eventValue: any,
  form: Recordable,
  schema: FormSchema,
  disabled: boolean,
  excontext: Recordable
) {
  if (isFunction(eventValue)) {
    return (event: any) => eventValue(event, form, schema, disabled, excontext)
  }
  return () => undefined
}

export function getSlotKey(schema: FormSchema) {
  return (schema.key || schema.field || '').replace(/\./g, '-')
}

export function getFieldName(fieldNames: Recordable | undefined, key: string, def: string) {
  return fieldNames?.[key] ?? def
}
