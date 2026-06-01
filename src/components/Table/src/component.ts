import type { Component } from 'vue'
import type { TableFormComponentName } from './types'
import {
  AutoComplete,
  Cascader,
  CheckboxGroup,
  DatePicker,
  Input,
  InputNumber,
  InputTag,
  Mention,
  RangePicker,
  RadioGroup,
  Select,
  Slider,
  Switch,
  TimePicker,
  TreeSelect
} from '@arco-design/web-vue'
import AbUpload from '@/components/Upload'

/** Table 编辑态默认支持的 Arco 组件映射。 */
const defaultComponents: Recordable<Component, TableFormComponentName> = {
  AutoComplete,
  Cascader,
  CheckboxGroup,
  DatePicker,
  Input,
  InputNumber,
  InputTag,
  Mention,
  RangePicker,
  RadioGroup,
  Select,
  Slider,
  Switch,
  TimePicker,
  TreeSelect,
  Upload: AbUpload
}

/** 判断组件值是否应按数组处理的默认策略。 */
const defaultArrayStrategies: Partial<
  Record<TableFormComponentName, (cps: Recordable) => boolean>
> = {
  CheckboxGroup: () => true,
  InputTag: () => true,
  Select: (cps: Recordable) => !!cps.multiple,
  TreeSelect: (cps: Recordable) => !!cps.multiple || !!cps.treeCheckable,
  TimePicker: (cps: Recordable) => cps.type === 'time-range',
  RangePicker: () => true,
  Cascader: (cps: Recordable) => {
    const cascaderProps = { multiple: false, pathMode: true, ...cps }
    return cascaderProps.multiple || cascaderProps.pathMode !== false
  }
}

export { defaultComponents, defaultArrayStrategies }
