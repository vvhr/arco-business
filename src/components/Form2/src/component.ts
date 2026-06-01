import type { Component } from 'vue'
import type { AbFormComponentName } from './types'
import {
  Alert,
  AutoComplete,
  Cascader,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  Divider,
  Image,
  Input,
  InputNumber,
  InputTag,
  Mention,
  RadioGroup,
  RangePicker,
  Rate,
  Result,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Textarea,
  VerificationCode
} from '@arco-design/web-vue'
import AbTable from '@/components/Table'
import AbUpload from '@/components/Upload'
import AbComboInput from '@/components/ComboInput'
import AbText from '@/components/Text'
import Blank from './components/Blank.vue'
import Disclosure from './components/Disclosure.vue'
import Group from './components/Group.vue'

const defaultComponents: Recordable<Component, AbFormComponentName> = {
  Group,
  Disclosure,
  Blank,
  Alert,
  Divider,
  Text: AbText,
  Image,
  Result,
  AutoComplete,
  Cascader,
  CheckboxGroup,
  ColorPicker,
  ComboInput: AbComboInput,
  DatePicker,
  RangePicker,
  Input,
  InputNumber,
  InputTag,
  Mention,
  RadioGroup,
  Rate,
  Select,
  Slider,
  Switch,
  Table: AbTable,
  TimePicker,
  Transfer,
  TreeSelect,
  Textarea,
  Upload: AbUpload,
  VerificationCode
}

const defaultArrayStrategies: Partial<
  Record<AbFormComponentName, (cps: Recordable) => boolean>
> = {
  CheckboxGroup: () => true,
  InputTag: () => true,
  Transfer: () => true,
  Table: () => true,
  RangePicker: () => true,
  Select: cps => !!cps.multiple,
  TreeSelect: cps => !!cps.multiple || !!cps.treeCheckable,
  TimePicker: cps => cps.type === 'time-range',
  Cascader: cps => {
    const cascaderProps = { multiple: false, pathMode: true, ...cps }
    return !!cascaderProps.multiple || cascaderProps.pathMode !== false
  }
}

export { defaultComponents, defaultArrayStrategies }
