import { defineComponent } from 'vue'
import type { Component } from 'vue'
import { get } from 'lodash-es'
import { isExistAttr, isFunction } from '@/utils/is'
import { setReactiveValue } from '@/utils/set'
import { getAutoRulesMap } from '@/utils/rules'
import { getPlaceholder } from '@/locale/utils'
import { t } from '@/locale'
import { isDisabled } from '../utils'
import type {
  TableColumn,
  TableColumnFn,
  TableEmits,
  TableFormComponentName,
  TableFormComponentProps,
  TableFormInsidePropsRenders,
  TableProps,
  TableSlots
} from '../types'
import type { TableFormImportItemConfig } from '@/types/imports'

/** 为编辑态单元格生成组件、v-model、属性、事件和内部插槽。 */
export function useComponent(
  props: TableProps,
  slots: TableSlots,
  emits: TableEmits,
  row: Recordable,
  index: number,
  column: TableColumn,
  formModel: Recordable,
  components: Partial<Recordable<Component, TableFormComponentName>>,
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
) {
  const componentName = column?.editProps?.component || 'Input'
  const field = column.editProps?.field || column.field
  const freshKey = `${column.key || field}-${index}-${column.editProps?.componentProps?.freshKey || 0}`
  const rules = getFormItemRules()
  const formItemProps = {
    label: '',
    hideLabel: !hasRequiredRule(rules, column.editProps?.formItemProps?.autoRules),
    field: `${index}.${field}`,
    ...(column.editProps?.formItemProps || {}),
    rules
  }

  /** 从注册表中解析当前列配置的编辑组件。 */
  const getAnyComponent = () => {
    if (isExistAttr(components, componentName)) {
      return components[componentName] as ReturnType<typeof defineComponent>
    }
    return undefined
  }

  /** 生成编辑组件的双向绑定，支持主字段和 vBinds 扩展字段。 */
  function setModelValue() {
    const bindings: Record<string, any> = {}
    if (field) {
      const modelValueKey = isExistAttr(components, componentName)
        ? componentConfigs[componentName]?.modelValueKey || 'modelValue'
        : 'modelValue'

      bindings[modelValueKey] = get(row, field)
      bindings[`onUpdate:${modelValueKey}`] = (value: any) => {
        setReactiveValue(row, field, value)
      }
    }
    if (column.editProps?.componentProps?.vBinds) {
      Object.entries(column.editProps.componentProps.vBinds).forEach(([propName, fieldPath]) => {
        if (propName && fieldPath && typeof fieldPath === 'string') {
          bindings[propName] = get(row, fieldPath)
          bindings[`onUpdate:${propName}`] = (value: any) => {
            setReactiveValue(row, fieldPath, value)
          }
        }
      })
    }
    return bindings
  }

  /** 合并手写 rules 与 autoRules 生成 Arco FormItem 校验规则。 */
  function getFormItemRules() {
    if (column.editProps?.formItemProps?.autoRules?.length) {
      const rules: any[] = []
      const autoRulesMap = getAutoRulesMap()
      column.editProps.formItemProps.autoRules.forEach((ruleName: string) => {
        if (autoRulesMap[ruleName] !== undefined) {
          const rule = Object.assign({}, autoRulesMap[ruleName])
          rule.message = rule.message.replace('{label}', column.label || column.field || '')
          rules.push(rule)
        }
      })
      if (rules.length) {
        return rules
      }
    }
    return column.editProps?.formItemProps?.rules || []
  }

  /** 判断当前编辑单元格是否包含必填规则，用于决定是否保留必填符号占位。 */
  function hasRequiredRule(rules: any, autoRules: string[] = []) {
    const ruleList = Array.isArray(rules) ? rules : rules ? [rules] : []
    return ruleList.some(rule => rule?.required) || autoRules.some(isRequiredAutoRule)
  }

  /** 生成编辑组件属性。 */
  function setComponentProps(): Recordable {
    const componentProps = column.editProps?.componentProps || {}
    const compProps: Recordable = {
      style: {
        width: '100%'
      },
      ...getPlaceholderText(column, componentConfigs),
      ...componentProps,
      ...setAttrsOptions(row, index, column, componentProps, formModel, props),
      disabled: isDisabled(props, column, row, index),
      ...getDynamicComponentProps(column, formModel, props)
    }

    delete compProps.vBinds
    return compProps
  }

  /** 将组件事件配置包装成带行上下文的事件处理函数。 */
  function setComponentEvent(): Recordable {
    if (!column.editProps?.componentEvent) {
      return {}
    }
    const compEvents = {}
    Object.keys(column.editProps.componentEvent).forEach(eventName => {
      const eventFn = column.editProps?.componentEvent?.[eventName]
      if (isFunction(eventFn)) {
        compEvents[eventName] = getComponentEventFunction(
          eventFn,
          row,
          index,
          column,
          formModel,
          props.excontext
        )
      }
    })
    return compEvents
  }

  /** 将 insideProps.renders 转换为 Vue 插槽对象。 */
  function setInsideRenders(): Recordable {
    const slotObj: Recordable = {}
    const insideRenders: TableFormInsidePropsRenders = column.editProps?.insideProps?.renders || {}
    for (const slotName in insideRenders) {
      const fn = insideRenders[slotName]
      if (isFunction(fn)) {
        slotObj[slotName] = () => fn(row, index, column, formModel, props.excontext, props.editable)
      } else if (typeof fn === 'string') {
        slotObj[slotName] = () => fn
      }
    }
    return slotObj
  }

  return {
    getAnyComponent,
    setModelValue,
    setComponentProps,
    setComponentEvent,
    setInsideRenders,
    field,
    freshKey,
    formItemProps,
    componentName
  }
}

/** 按组件类型自动生成输入或选择类 placeholder。 */
function getPlaceholderText(
  column: TableColumn,
  componentConfigs: Partial<Recordable<TableFormImportItemConfig, TableFormComponentName>>
) {
  const needInputPlaceholder = ['AutoComplete', 'Input', 'InputNumber', 'InputTag', 'Mention']
  const needSelectPlaceholder = ['Cascader', 'DatePicker', 'Select', 'TimePicker', 'TreeSelect']
  const componentName = column.editProps?.component || 'Input'
  const component = componentConfigs[componentName]

  if (needInputPlaceholder.includes(componentName) || component?.needInputPlaceholder) {
    return {
      placeholder: getPlaceholder(t('form.placeholder.input'), column?.label || '')
    }
  }

  if (needSelectPlaceholder.includes(componentName) || component?.needSelectPlaceholder) {
    const selectPlaceholder = getPlaceholder(t('form.placeholder.select'), column?.label || '')
    return {
      placeholder: selectPlaceholder
    }
  }

  return {}
}

/** 执行 _v_componentProps，获取行上下文相关的动态组件属性。 */
function getDynamicComponentProps(column: TableColumn, formModel: Recordable, props: TableProps) {
  if (isFunction(column.editProps?._v_componentProps)) {
    return column.editProps?._v_componentProps({}, null, column, formModel, props.excontext, props.editable) || {}
  }
  return {}
}

/** 解析 options 和 fieldNames，兼容静态和动态选项。 */
function setAttrsOptions(
  row: Recordable,
  index: number,
  column: TableColumn,
  componentProps: TableFormComponentProps,
  formModel: Recordable,
  props: TableProps
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
  if (typeof componentProps.options === 'function') {
    return {
      options: componentProps.options(row, index, column, formModel, props.excontext, props.editable),
      fieldNames
    }
  }
  if (Array.isArray(componentProps.options)) {
    return {
      options: componentProps.options,
      fieldNames
    }
  }
  return {}
}

/** 判断 autoRules 中是否包含必填类规则。 */
function isRequiredAutoRule(ruleName: string) {
  return ['isRequired', 'isRequiredArray'].includes(ruleName)
}

/** 包装组件事件函数，补齐行、列、form 和扩展上下文。 */
function getComponentEventFunction(
  eventValue: any,
  row: Recordable,
  index: number,
  column: TableColumn,
  form: Recordable,
  excontext: Recordable
) {
  if (typeof eventValue === 'function') {
    return (event: any) =>
      eventValue(event, row, index, column, form, excontext) as TableColumnFn<any>
  }
  return () => undefined
}
