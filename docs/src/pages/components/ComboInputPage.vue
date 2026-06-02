<template>
  <PageHeader eyebrow="Components" title="AbComboInput 组合输入器" description="把证号、邮箱、编码等由固定文本和多个输入控件拼接的场景封装成单一输入组件。" :tags="['Template input', 'Composed field', 'v-model']" />
  <SectionBlock id="combo-overview" kicker="Overview" title="模板输入模型" description="字符串模板适合简单占位符，详细模板适合自定义控件类型、选项和占位提示。" />
  <SectionBlock id="combo-arco-diff" kicker="Use Case" title="单字段管理组合输入" description="当编号、邮箱、合同号等字段由固定文本和多个输入片段组成时，原生做法通常要组合多个 Input、Select、DatePicker，并额外拼接值。AbComboInput 用一个 v-model 管理完整字符串，同时通过 change 事件暴露模板参数。" />
  <DemoBlock id="combo-basic-demo" title="字符串模板与详细模板" description="展示不动产证号、邮箱和合同编号等固定文本加输入片段的场景。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="combo-api" title="Props API" description="组合输入器的核心入参围绕模板、值、尺寸和禁用态组织。" :rows="propsRows" />
  <ApiTable id="combo-events" title="Events API" description="事件用于同步完整字符串，并获取模板内各输入控件的参数模型。" :rows="eventsRows" />
  <ApiTable id="combo-types" title="Types API" description="模板项通过 tag 区分固定文本和输入性组件，componentProps 会按 tag 获得对应类型。" :rows="typesRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/combo-input/basic.vue'
import source from '@docs/demos/combo-input/basic.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '完整组合输入值，支持 v-model。', type: 'string', defaultValue: "''" },
  { name: 'template', description: '字符串模板或详细模板。', type: 'string | ComboTemplate[]', defaultValue: '-' },
  { name: 'disabled', description: '是否禁用所有输入性模板项。', type: 'boolean', defaultValue: 'false' },
  { name: 'size', description: '组件尺寸。', type: 'mini | small | medium | large', defaultValue: 'medium' },
  { name: 'debounce', description: '输入防抖延迟，单位 ms，0 表示不防抖。', type: 'number', defaultValue: '0' }
]

const eventsRows: ApiRow[] = [
  { name: 'update:modelValue', description: '完整组合字符串变化时触发。', type: '(value: string) => void', defaultValue: '-' },
  { name: 'change', description: '组合值变化时触发，同时返回模板参数模型。', type: '(event: ComboInputChangeEvent) => void', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'ComboTemplateTag', description: '模板项标签类型。', type: 'span | select | input | date-picker | range-picker', defaultValue: '-' },
  { name: 'ComboTemplate', description: '模板项配置，输入性组件可声明 prop 和 componentProps。', type: '{ tag; prop?; content?; componentProps? }', defaultValue: '-' },
  { name: 'ComboInputChangeEvent', description: 'change 事件参数，包含完整值和内部参数模型。', type: '{ value: string; params: Record<string, any> }', defaultValue: '-' },
  { name: 'InputComponentProps', description: 'input 模板项的常用 Arco Input 属性。', type: '{ placeholder?; allowClear?; maxLength?; type?; prepend?; append?; ... }', defaultValue: '-' },
  { name: 'SelectComponentProps', description: 'select 模板项的常用 Arco Select 属性。', type: '{ placeholder?; options?; multiple?; allowSearch?; fieldNames?; ... }', defaultValue: '-' },
  { name: 'DatePickerComponentProps', description: 'date-picker 模板项的常用 Arco DatePicker 属性。', type: '{ format?; valueFormat?; mode?; showTime?; disabledDate?; ... }', defaultValue: '-' },
  { name: 'RangePickerComponentProps', description: 'range-picker 模板项的常用 Arco RangePicker 属性。', type: '{ format?; valueFormat?; separator?; shortcuts?; disabledDate?; ... }', defaultValue: '-' },
  { name: 'ComboInputSize', description: '组件尺寸类型。', type: 'mini | small | medium | large', defaultValue: '-' }
]
</script>
