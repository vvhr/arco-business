<template>
  <PageHeader eyebrow="Components" title="AbComboInput 组合输入器" description="把证号、邮箱、编码等由固定文本和多个输入控件拼接的场景封装成单一输入组件。" :tags="['Template input', 'Composed field', 'v-model']" />
  <SectionBlock id="combo-overview" kicker="Overview" title="模板输入模型" description="字符串模板适合简单占位符，详细模板适合自定义控件类型、选项和占位提示。" />
  <DemoBlock id="combo-basic-demo" title="字符串模板与详细模板" description="展示不动产证号和邮箱两类组合输入场景。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="combo-api" title="Props API" description="组合输入器的核心入参围绕模板、值、尺寸和禁用态组织。" :rows="propsRows" />
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
  { name: 'size', description: '组件尺寸。', type: 'mini | small | medium | large', defaultValue: 'medium' },
  { name: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' }
]
</script>
