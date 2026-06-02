<template>
  <PageHeader eyebrow="Components" title="AbText 增强文本" description="面向业务状态、提示、复制、截断和高亮交互的文本展示组件。" :tags="['Status text', 'Highlight', 'Copyable']" />
  <SectionBlock id="text-overview" kicker="Overview" title="信息表达层级" description="AbText 用于把状态圆点、图标、引用块和高亮关键词组合成可扫描的业务文本，而不是替代普通段落。" />
  <SectionBlock id="text-arco-diff" kicker="Use Case" title="复杂业务文本展示" description="状态、提示、备注和审批意见经常需要圆点、块样式、关键词高亮、复制、换行裁剪和高亮点击事件。AbText 把这些能力收敛到一个轻量组件，避免每个页面重复拼接 Tag、Tooltip、Typography 和复制逻辑。" />
  <DemoBlock id="text-basic-demo" title="状态、块、高亮与裁剪" description="展示图标、圆点、块样式、高亮点击、复制、两行裁剪和展开能力。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <ApiTable id="text-api" title="Props API" description="文本组件的 API 重点在内容、状态视觉、关键词匹配和复制行为。" :rows="propsRows" />
  <ApiTable id="text-events" title="Events API" description="文本事件用于高亮词点击和复制成功后的业务反馈。" :rows="eventsRows" />
  <ApiTable id="text-types" title="Types API" description="状态、圆点和高亮配置均有导出类型，便于业务侧复用。" :rows="typesRows" />
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
  { name: 'value', description: '展示文本。', type: 'string', defaultValue: "''" },
  { name: 'icon', description: '前置 Iconify 图标。', type: 'string', defaultValue: '-' },
  { name: 'iconClass', description: '图标类名。', type: 'string', defaultValue: "''" },
  { name: 'iconStyle', description: '图标样式。', type: 'string | CSSProperties', defaultValue: "''" },
  { name: 'dotStatus', description: '状态圆点。', type: 'primary | success | warning | danger | info', defaultValue: '-' },
  { name: 'dotType', description: '圆点样式类型。', type: 'plain | shadow', defaultValue: 'plain' },
  { name: 'dotSize', description: '圆点尺寸。', type: 'mini | small | medium | large', defaultValue: 'medium' },
  { name: 'blockStatus', description: '引用块左侧边框状态。', type: 'primary | success | warning | danger | info', defaultValue: 'primary' },
  { name: 'fontSize', description: '文本字号，不传时继承父级。', type: 'string | number', defaultValue: '-' },
  { name: 'block', description: '是否使用引用块样式。', type: 'boolean', defaultValue: 'false' },
  { name: 'patterns', description: '高亮关键词。', type: 'string | string[]', defaultValue: '-' },
  { name: 'hlClass', description: '高亮元素类名。', type: 'string', defaultValue: "''" },
  { name: 'hlStyle', description: '高亮元素样式。', type: 'string | CSSProperties', defaultValue: "''" },
  { name: 'truncate', description: '文本截断，true 为默认单行，数字表示行数。', type: 'boolean | number', defaultValue: 'false' },
  { name: 'expandable', description: '截断后是否允许展开。', type: 'boolean', defaultValue: 'false' },
  { name: 'expandText', description: '展开按钮文案，未传时使用 locale。', type: 'string', defaultValue: "''" },
  { name: 'collapseText', description: '收起按钮文案，未传时使用 locale。', type: 'string', defaultValue: "''" },
  { name: 'copyable', description: '是否支持复制。', type: 'boolean', defaultValue: 'false' },
  { name: 'copyIcon', description: '复制按钮图标。', type: 'string', defaultValue: 'icon-park-outline:copy' },
  { name: 'copySuccessText', description: '复制成功提示，未传时使用 locale。', type: 'string', defaultValue: "''" }
]

const eventsRows: ApiRow[] = [
  { name: 'hlClick', description: '高亮关键词被点击时触发。', type: '(value: string) => void', defaultValue: '-' },
  { name: 'copy', description: '复制成功后触发。', type: '(text: string) => void', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'TextStatus', description: '通用文本状态。', type: 'primary | success | warning | danger | info', defaultValue: '-' },
  { name: 'DotStatus', description: '圆点状态，允许空字符串表示不显示。', type: "'' | TextStatus", defaultValue: '-' },
  { name: 'DotType', description: '圆点视觉类型。', type: 'plain | shadow', defaultValue: '-' },
  { name: 'DotSize', description: '圆点尺寸。', type: 'mini | small | medium | large', defaultValue: '-' },
  { name: 'BlockStatus', description: '引用块状态。', type: 'TextStatus', defaultValue: '-' },
  { name: 'HighlightPatterns', description: '高亮匹配配置。', type: 'string | string[]', defaultValue: '-' },
  { name: 'TextEmits', description: '文本事件签名集合。', type: 'hlClick | copy', defaultValue: '-' }
]
</script>
