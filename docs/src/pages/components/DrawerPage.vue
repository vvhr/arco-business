<template>
  <PageHeader eyebrow="Components" title="AbDrawer 抽屉" description="基于 Arco Drawer 封装，适合详情面板、过滤条件、轻量编辑和跨页面辅助信息。" :tags="['Panel', 'Placement', 'Detail view']" />
  <SectionBlock id="drawer-overview" kicker="Overview" title="选择抽屉的时机" description="当用户需要保留当前页面上下文，又要查看或编辑一段相关信息时，抽屉比整页跳转更合适。" />
  <DemoBlock id="drawer-basic-demo" title="不同方向抽屉" description="展示右侧详情抽屉和底部辅助抽屉。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="drawer-api" title="Props API" description="AbDrawer 的核心配置集中在显示状态、方向、标题和滚动策略。" :rows="propsRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/drawer/basic.vue'
import source from '@docs/demos/drawer/basic.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '显示状态，支持 v-model。', type: 'boolean', defaultValue: 'false' },
  { name: 'title', description: '标题文本。', type: 'string', defaultValue: '-' },
  { name: 'placement', description: '抽屉方向。', type: 'top | right | bottom | left', defaultValue: 'right' },
  { name: 'scrollable', description: '是否启用内置滚动区域。', type: 'boolean', defaultValue: 'false' },
  { name: 'beforeClose', description: '关闭前回调。', type: '(done: () => void) => void', defaultValue: '-' }
]
</script>
