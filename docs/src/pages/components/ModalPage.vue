<template>
  <PageHeader eyebrow="Components" title="AbModal 对话框" description="基于 Arco Modal 封装，统一 modelValue、标题、全屏、滚动区域和关闭前确认。" :tags="['Dialog', 'Fullscreen', 'Scrollable']" />
  <SectionBlock id="modal-overview" kicker="Overview" title="交互边界" description="对话框适合承载短流程、确认动作和局部表单。长内容建议启用 scrollable，避免页面滚动与弹层滚动混淆。" />
  <DemoBlock id="modal-basic-demo" title="基础与滚动对话框" description="展示基础弹窗、全屏切换和内部滚动区域。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="modal-api" title="Props API" description="AbModal 保留 Arco Modal 的常见配置，同时收敛标题、全屏和滚动语义。" :rows="propsRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/modal/basic.vue'
import source from '@docs/demos/modal/basic.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '显示状态，支持 v-model。', type: 'boolean', defaultValue: 'false' },
  { name: 'title', description: '标题文本。', type: 'string', defaultValue: '-' },
  { name: 'showFullscreen', description: '是否展示全屏切换。', type: 'boolean', defaultValue: 'false' },
  { name: 'scrollable', description: '是否启用内置滚动区域。', type: 'boolean', defaultValue: 'false' },
  { name: 'beforeClose', description: '关闭前回调。', type: '(done: () => void) => void', defaultValue: '-' }
]
</script>
