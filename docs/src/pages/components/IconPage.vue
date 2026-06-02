<template>
  <PageHeader eyebrow="Components" title="AbIcon 图标" description="基于 Iconify 的图标组件，用于统一业务组件内的图标尺寸、颜色和自定义图标集。" :tags="['Iconify', 'Custom collection', 'Size control']" />
  <SectionBlock id="icon-overview" kicker="Overview" title="使用策略" description="图标应服务于识别和操作反馈，不作为装饰堆叠。建议在按钮、状态、表格操作和提示文本中保持统一尺寸。" />
  <DemoBlock id="icon-basic-demo" title="常用图标" description="展示常见业务图标、尺寸和文档站内的视觉比例。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="icon-api" title="Props API" description="AbIcon 的核心入参保持轻量，复杂图标集通过安装选项注册。" :rows="propsRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/icon/basic.vue'
import source from '@docs/demos/icon/basic.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'icon', description: 'Iconify 图标名。', type: 'string', defaultValue: '-' },
  { name: 'size', description: '图标尺寸。', type: 'number | string', defaultValue: '16' },
  { name: 'color', description: '图标颜色。', type: 'string', defaultValue: 'currentColor' }
]
</script>
