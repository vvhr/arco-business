import { computed, type ComputedRef, type Ref } from 'vue'
import type { FieldRule } from '@arco-design/web-vue'
import type {
  FormComponentProps,
  FormItemProps,
  FormProps,
  FormSchema,
  FormSlots
} from '../types'
import { getAutoRulesMap } from '@/utils/rules'
import { isArray, isString } from 'lodash-es'
import { getSlot } from '@/utils/get'
import { isFunction } from '@/utils/is'
import {
  getComponentPropValue,
  getLabel,
  getNoLabel,
  getSchemaPropValue,
  getSlotKey,
  getTrueComponentProps
} from '../utils'

export function useFormItem(
  props: FormProps,
  slots: FormSlots,
  schema: FormSchema,
  formModel: Ref<Recordable>
) {
  const componentProps: FormComponentProps = getTrueComponentProps(
    schema,
    formModel.value,
    props
  )
  const formItemLabel = computed<string>(() => getFormItemLabel())
  const isDisabled = computed<boolean>(() => getDisabled())
  const slotKey = getSlotKey(schema)

  function getFormItemProps(): Recordable {
    const schemaItemProps = schema.formItemProps || {}
    const globalItemProps = props.schemaProps.formItemProps || {}
    const itemProps: Recordable = {
      ...globalItemProps,
      ...schemaItemProps,
      field: schema.field || '',
      label: formItemLabel.value,
      class: [
        'ab-form-item',
        getNoLabelClass(),
        getAddClass(),
        getDisabledClass()
      ]
        .filter(Boolean)
        .join(' '),
      required: getRequired(),
      rules: getItemRules(),
      labelColFlex: schemaItemProps.labelColFlex ?? props.labelColFlex,
      style: mergeDisabledStyle(itemPropsStyle(globalItemProps, schemaItemProps), getDisabledStyleVariables())
    }
    if ((schemaItemProps.layout ?? props.layout) === 'vertical') {
      itemProps.labelColProps = { span: 24, ...(itemProps.labelColProps || {}) }
      itemProps.wrapperColProps = { span: 24, ...(itemProps.wrapperColProps || {}) }
    }
    if (!formItemLabel.value) {
      itemProps.labelColProps = { ...(itemProps.labelColProps || {}), span: 0 }
      itemProps.wrapperColProps = { ...(itemProps.wrapperColProps || {}), span: 24 }
      delete itemProps.labelColFlex
    }
    if (schemaItemProps.labelAlign) {
      itemProps.labelColStyle = {
        ...(itemProps.labelColStyle || {}),
        textAlign: schemaItemProps.labelAlign
      }
    }
    delete itemProps.noLabel
    delete itemProps.autoRules
    delete itemProps.addClass
    delete itemProps.extraRender
    delete itemProps.helpRender
    delete itemProps.layout
    delete itemProps.labelAlign
    delete itemProps.disabled
    return itemProps
  }

  function itemPropsStyle(globalItemProps: FormItemProps, schemaItemProps: FormItemProps) {
    return schemaItemProps.style ?? globalItemProps.style
  }

  function getDisabledStyleVariables(): Recordable | undefined {
    if (!isDisabled.value) {
      return undefined
    }
    const disabledStyles = getResolvedDisabledStyles()
    const style: Recordable = {}
    if (disabledStyles.textColor !== false) {
      style['--color-text-4'] = disabledStyles.textColor
    }
    if (disabledStyles.borderColor !== false) {
      style['--color-primary-light-3'] = disabledStyles.borderColor
    }
    if (disabledStyles.bgColor !== false) {
      style['--color-fill-2'] = disabledStyles.bgColor
    }
    return Object.keys(style).length > 0 ? style : undefined
  }

  function getResolvedDisabledStyles() {
    return {
      textColor: 'var(--color-text-1)',
      borderColor: 'rgb(var(--arcoblue-6))',
      bgColor: 'transparent',
      noPadding: false,
      defaultCursor: false,
      noSuffix: false,
      ...(props.disabledStyles || {})
    }
  }

  function getDisabledClass() {
    if (!isDisabled.value) {
      return ''
    }
    const disabledStyles = getResolvedDisabledStyles()
    return [
      'ab-form-item-is-disabled',
      disabledStyles.noPadding ? 'ab-form-item-disabled-no-padding' : '',
      disabledStyles.defaultCursor ? 'ab-form-item-disabled-default-cursor' : '',
      disabledStyles.noSuffix ? 'ab-form-item-disabled-no-suffix' : ''
    ]
      .filter(Boolean)
      .join(' ')
  }

  function mergeDisabledStyle(originStyle: FormItemProps['style'], disabledStyle?: Recordable) {
    if (!disabledStyle) {
      return originStyle
    }
    if (!originStyle) {
      return disabledStyle
    }
    return Array.isArray(originStyle) ? [...originStyle, disabledStyle] : [originStyle, disabledStyle]
  }

  function getItemRules(): FieldRule | FieldRule[] {
    if (schema.formItemProps?.autoRules?.length) {
      const rules: FieldRule[] = []
      const autoRulesMap = getAutoRulesMap()
      schema.formItemProps.autoRules.forEach(ruleName => {
        const rawRule = autoRulesMap[ruleName]
        if (rawRule) {
          const rule = { ...rawRule }
          if (rule.message) {
            rule.message = rule.message.replace('{label}', formItemLabel.value)
          }
          rules.push(rule)
        }
      })
      if (rules.length) {
        return rules
      }
    }
    return schema.formItemProps?.rules || []
  }

  function getFormItemLabel() {
    const noLabel = getNoLabel(schema, formModel.value, props)
    return noLabel ? '' : getLabel(schema, formModel.value, props)
  }

  function getDisabled() {
    if (props.disabled) {
      return true
    }
    return getComponentPropValue(
      'disabled',
      true,
      schema,
      formModel.value,
      componentProps,
      props,
      props.schemaProps?.componentProps?.disabled ?? false
    )
  }

  function getRequired() {
    if (isDisabled.value) {
      return undefined
    }
    if (schema.formItemProps?.required) {
      return true
    }
    const rules = schema.formItemProps?.autoRules?.length ? getItemRules() : schema.formItemProps?.rules
    const ruleList = Array.isArray(rules) ? rules : rules ? [rules] : []
    return ruleList.some(rule => rule.required) ? true : undefined
  }

  function getNoLabelClass() {
    return formItemLabel.value.length === 0 ? 'no-label' : ''
  }

  function getAddClass() {
    const addClass = schema.formItemProps?.addClass
    if (isString(addClass)) {
      return addClass
    }
    if (isArray(addClass)) {
      return addClass.join(' ')
    }
    return ''
  }

  function getExtraSlot() {
    if (isFunction(schema.formItemProps?.extraRender)) {
      const render = schema.formItemProps.extraRender(
        formModel.value,
        schema,
        props.disabled,
        props.excontext
      )
      if (render !== false) {
        return () => render
      }
    }
    if (slots[`${slotKey}--extra`]) {
      return () => getSlot(slots, `${slotKey}--extra`, formModel.value)
    }
    return undefined
  }

  function getHelpSlot() {
    if (isFunction(schema.formItemProps?.helpRender)) {
      const render = schema.formItemProps.helpRender(
        formModel.value,
        schema,
        props.disabled,
        props.excontext
      )
      if (render !== false) {
        return () => render
      }
    }
    if (slots[`${slotKey}--help`]) {
      return () => getSlot(slots, `${slotKey}--help`, formModel.value)
    }
    return undefined
  }

  function getInsideSlots(): Recordable {
    const slotObj: Recordable = {}
    const insideSlots = schema.insideProps?.slots || {}
    const insideRenders = schema.insideProps?.renders || {}
    Object.keys(insideRenders).forEach(slotName => {
      if (Object.prototype.hasOwnProperty.call(insideSlots, slotName)) {
        return
      }
      const fn = insideRenders[slotName]
      if (isFunction(fn)) {
        slotObj[slotName] = (...args: any[]) =>
          fn(formModel.value, schema, props.disabled, props.excontext, ...args)
      } else if (typeof fn === 'string') {
        slotObj[slotName] = () => fn
      }
    })
    Object.keys(insideSlots).forEach(slotName => {
      const enableSlot = getSchemaPropValue(
        insideSlots[slotName],
        schema,
        formModel.value,
        props,
        'boolean',
        false
      )
      if (enableSlot) {
        slotObj[slotName] = (...args: any[]) => {
          const slotData =
            args.length > 0 ? { form: formModel.value, ...args[0] } : { form: formModel.value }
          return getSlot(slots, `${slotKey}--${slotName}`, slotData)
        }
      }
    })
    return slotObj
  }

  return {
    trueComponentProps: componentProps,
    isDisabled: isDisabled as ComputedRef<boolean>,
    getFormItemProps,
    formItemLabel,
    slotKey,
    getExtraSlot,
    getHelpSlot,
    getInsideSlots
  }
}
