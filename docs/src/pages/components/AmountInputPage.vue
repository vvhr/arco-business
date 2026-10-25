<template>
  <PageHeader
    eyebrow="Components"
    title="AbAmountInput 金额输入"
    description="以十进制字符串保存金额，提供精度截断、千分位、中文大写和真实数值编辑通知。"
    :tags="['String amount', 'Precision', 'Form / Table']"
  />
  <SectionBlock
    id="amount-contract"
    kicker="Model"
    title="字符串模型与事件边界"
    description="建议回填十进制字符串，避免金额进入 JavaScript number 时已丢失精度。编辑输出为字符串，清空输出 emptyValue；超出 precision 的小数直接截断，precision=0 只保留整数部分。外部科学计数值按精度展开。程序回填和只聚焦失焦不触发 change，真实用户数值编辑在提交输入时触发 change；仅调整小数格式不视为改价。"
  />
  <DemoBlock
    id="amount-basic"
    title="编辑、回填与只读"
    description="编辑后失焦观察 change；点击程序回填只更新模型，不通知改价。中文大写展示到角、分，不改变四位小数模型。"
    :source="basicSource"
  >
    <BasicDemo />
  </DemoBlock>
  <DemoBlock
    id="amount-schema"
    title="内置表单和表格编辑组件"
    description="在 FormSchema.component 或 TableColumn.editProps.component 中使用 AmountInput，无需自定义注册。"
    :source="schemaSource"
  >
    <SchemaDemo />
  </DemoBlock>
  <ApiTable id="amount-props" title="Props API" :rows="propsRows" />
  <ApiTable id="amount-events" title="Events API" :rows="eventsRows" />
  <ApiTable id="amount-types" title="Types API" :rows="typesRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/amount-input/basic.vue'
import basicSource from '@docs/demos/amount-input/basic.vue?raw'
import SchemaDemo from '@docs/demos/amount-input/schema.vue'
import schemaSource from '@docs/demos/amount-input/schema.vue?raw'

const propsRows: ApiRow[] = [
  {
    name: 'modelValue',
    description: '金额模型，建议使用十进制字符串。支持 v-model。',
    type: 'string | number | null',
    defaultValue: 'null'
  },
  {
    name: 'emptyValue',
    description: '清空时回写的值；按业务接口选择 null 或其他允许值。',
    type: 'null | string | number',
    defaultValue: 'null'
  },
  {
    name: 'precision',
    description: '小数位数，超出位数截断；0 表示只保留整数。',
    type: 'number',
    defaultValue: '4'
  },
  { name: 'placeholder', description: '输入框占位文本。', type: 'string', defaultValue: "''" },
  {
    name: 'readonly',
    description: '只读展示，不回写金额。',
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: '禁用输入，不回写金额。',
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'showChineseUppercase',
    description: '编辑态显示中文大写，角分后的小数不参与大写显示。',
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'uppercasePlaceholder',
    description: '无金额时的中文大写区域占位文本。',
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'useThousandSeparatorInEdit',
    description: '编辑显示千分位，模型不包含逗号。',
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'useThousandSeparatorInReadonly',
    description: '只读展示千分位。',
    type: 'boolean',
    defaultValue: 'true'
  }
]
const eventsRows: ApiRow[] = [
  {
    name: 'update:modelValue',
    description: '输入归一化后的字符串或清空值。',
    type: '(value: AmountModelValue) => void',
    defaultValue: '-'
  },
  {
    name: 'change',
    description: '真实用户数值编辑提交时触发；回填、格式变化和单纯聚焦失焦不触发。',
    type: '(value: AmountModelValue) => void',
    defaultValue: '-'
  },
  {
    name: 'focus / blur',
    description: '焦点事件，保留原始 FocusEvent。',
    type: '(event: FocusEvent) => void',
    defaultValue: '-'
  }
]
const typesRows: ApiRow[] = [
  {
    name: 'AmountInputProps / AmountInputEmits',
    description: '组件属性和事件声明。',
    type: 'interface',
    defaultValue: '-'
  },
  {
    name: 'AmountModelValue / AmountEmptyValue',
    description: '模型值及清空值类型。',
    type: 'string | number | null',
    defaultValue: '-'
  }
]
</script>
