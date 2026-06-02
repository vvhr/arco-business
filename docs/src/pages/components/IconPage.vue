<template>
  <PageHeader eyebrow="Components" title="AbIcon 图标" description="基于 Iconify 的图标组件，用于统一业务组件内的图标尺寸、颜色和自定义图标集。" :tags="['Iconify', 'Custom collection', 'Size control']" />
  <SectionBlock id="icon-overview" kicker="Overview" title="使用策略" description="图标应服务于识别和操作反馈，不作为装饰堆叠。建议在按钮、状态、表格操作和提示文本中保持统一尺寸。" />
  <DemoBlock id="icon-basic-demo" title="常用图标" description="展示常见业务图标、尺寸和文档站内的视觉比例。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="icon-api" title="Props API" description="AbIcon 的核心入参保持轻量，复杂图标集通过安装选项注册。" :rows="propsRows" />
  <ApiTable id="icon-functions" title="Functions API" description="组件库导出 Iconify 图标集注册函数，适合接入业务私有图标。" :rows="functionRows" />
  <ApiTable id="icon-types" title="Types API" description="图标相关类型来自 Iconify 数据结构，组件只额外约束 icon、color 和 size。" :rows="typesRows" />
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

const functionRows: ApiRow[] = [
  { name: 'addIcon', description: '注册单个 Iconify 图标。', type: '(name: string, data: IconData) => void', defaultValue: '-' },
  { name: 'addIconCollection', description: '注册一个 Iconify 图标集合。', type: '(collection: IconCollection) => boolean', defaultValue: '-' },
  { name: 'addIconCollections', description: '批量注册 Iconify 图标集合。', type: '(collections: IconCollection[]) => void', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'IconProps', description: 'AbIcon 组件属性。', type: '{ icon: string; color?: string; size?: string | number }', defaultValue: '-' },
  { name: 'IconData', description: 'Iconify 单个图标数据。', type: '{ body: string; width?: number; height?: number; ... }', defaultValue: '-' },
  { name: 'IconCollection', description: 'Iconify 图标集合数据。', type: '{ prefix: string; icons: Record<string, IconData>; ... }', defaultValue: '-' }
]
</script>
