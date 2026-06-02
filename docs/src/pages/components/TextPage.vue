<template>
  <PageHeader eyebrow="Components" title="AbText 增强文本" description="面向业务状态、提示、复制、截断和高亮交互的文本展示组件。" :tags="['Status text', 'Highlight', 'Copyable']" />
  <SectionBlock id="text-overview" kicker="Overview" title="信息表达层级" description="AbText 用于把状态圆点、图标、引用块和高亮关键词组合成可扫描的业务文本，而不是替代普通段落。" />
  <DemoBlock id="text-basic-demo" title="组合展示" description="展示图标、圆点、引用块、高亮点击和复制能力。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="text-api" title="Props API" description="文本组件的 API 重点在内容、状态视觉、关键词匹配和复制行为。" :rows="propsRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/text/basic.vue'
import source from '@docs/demos/text/basic.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'value', description: '展示文本。', type: 'string', defaultValue: '-' },
  { name: 'icon', description: '前置 Iconify 图标。', type: 'string', defaultValue: '-' },
  { name: 'dotStatus', description: '状态圆点。', type: 'primary | success | warning | danger | info', defaultValue: '-' },
  { name: 'patterns', description: '高亮关键词。', type: 'string | string[]', defaultValue: '-' },
  { name: 'copyable', description: '是否支持复制。', type: 'boolean', defaultValue: 'false' }
]
</script>
