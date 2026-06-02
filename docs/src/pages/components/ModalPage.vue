<template>
  <PageHeader eyebrow="Components" title="AbModal 对话框" description="基于 Arco Modal 封装，统一 modelValue、标题、全屏、滚动区域和关闭前确认。" :tags="['Dialog', 'Fullscreen', 'Scrollable']" />
  <SectionBlock id="modal-overview" kicker="Overview" title="交互边界" description="对话框适合承载短流程、确认动作和局部表单。长内容建议启用 scrollable，避免页面滚动与弹层滚动混淆。" />
  <SectionBlock id="modal-arco-diff" kicker="Compare" title="与 AModal 的核心差异" description="AbModal 自建标题栏和关闭按钮，内置全屏切换、右上角工具栏、拖拽标志、滚动区域和 beforeClose 拦截；默认摒弃原生底部按钮，便于业务自行实现更丰富的操作栏。" />
  <DemoBlock id="modal-basic-demo" title="基础与滚动对话框" description="展示基础弹窗、全屏切换和内部滚动区域。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <DemoBlock id="modal-advanced-demo" title="工具栏、拖拽标志与关闭拦截" description="展示 header-actions、draggable 标志、滚动内容、自定义 footer 和 beforeClose 拦截。" :source="advancedSource">
    <AdvancedDemo />
  </DemoBlock>
  <ApiTable id="modal-api" title="Props API" description="AbModal 保留 Arco Modal 的常见配置，同时收敛标题、全屏和滚动语义。" :rows="propsRows" />
  <ApiTable id="modal-events" title="Events API" description="事件用于同步显示状态、监听打开关闭和内部滚动。" :rows="eventsRows" />
  <ApiTable id="modal-expose" title="Expose API" description="启用 scrollable 后可通过实例方法控制内部滚动条。" :rows="exposeRows" />
  <ApiTable id="modal-slots" title="Slots API" description="插槽用于替换标题、补充标题操作区和自定义底部区域。" :rows="slotsRows" />
  <ApiTable id="modal-types" title="Types API" description="Modal 类型在 Arco ModalConfig 基础上排除了由 AbModal 接管的字段。" :rows="typesRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/modal/basic.vue'
import source from '@docs/demos/modal/basic.vue?raw'
import AdvancedDemo from '@docs/demos/modal/advanced.vue'
import advancedSource from '@docs/demos/modal/advanced.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '显示状态，支持 v-model。', type: 'boolean', defaultValue: 'false' },
  { name: 'title', description: '标题文本。', type: 'string', defaultValue: '-' },
  { name: 'hideTitle', description: '是否隐藏标题区域。', type: 'boolean', defaultValue: 'false' },
  { name: 'width', description: '弹窗宽度，继承 Arco Modal 配置。', type: 'string | number', defaultValue: '500px' },
  { name: 'mask', description: '是否显示遮罩。', type: 'boolean', defaultValue: 'true' },
  { name: 'unmountOnClose', description: '关闭后是否卸载内容。', type: 'boolean', defaultValue: 'true' },
  { name: 'maskClosable', description: '点击遮罩是否关闭。', type: 'boolean', defaultValue: 'false' },
  { name: 'renderToBody', description: '是否挂载到 body。', type: 'boolean', defaultValue: 'true' },
  { name: 'modalClass', description: '弹窗内容类名。', type: 'string | any[] | Record<string, boolean>', defaultValue: "''" },
  { name: 'bodyClass', description: '弹窗主体类名。', type: 'string | any[] | Record<string, boolean>', defaultValue: "''" },
  { name: 'escToClose', description: '是否允许 Esc 关闭。', type: 'boolean', defaultValue: 'false' },
  { name: 'draggable', description: '是否启用拖拽。', type: 'boolean', defaultValue: 'false' },
  { name: 'fullscreen', description: '是否默认全屏。', type: 'boolean', defaultValue: 'false' },
  { name: 'showFullscreen', description: '是否展示全屏切换。', type: 'boolean', defaultValue: 'false' },
  { name: 'alignCenter', description: '是否垂直居中。', type: 'boolean', defaultValue: 'true' },
  { name: 'scrollable', description: '是否启用内置滚动区域。', type: 'boolean', defaultValue: 'false' },
  { name: 'scrollbarHeight', description: '内置滚动条高度。', type: 'string | number', defaultValue: '400px' },
  { name: 'scrollbarType', description: 'Arco Scrollbar 类型。', type: 'track | embed', defaultValue: 'embed' },
  { name: 'scrollbarOuterClass', description: '滚动条外层类名。', type: 'string | Record<string, boolean> | any[]', defaultValue: "''" },
  { name: 'scrollbarOuterStyle', description: '滚动条外层样式。', type: 'string | CSSProperties', defaultValue: "''" },
  { name: 'bodyStyle', description: '弹窗主体样式，兼容 Arco bodyStyle。', type: 'string | CSSProperties', defaultValue: '-' },
  { name: 'beforeClose', description: '关闭前回调。', type: '(done: () => void) => void', defaultValue: '-' }
]

const eventsRows: ApiRow[] = [
  { name: 'update:modelValue', description: '显示状态变化时触发。', type: '(visible: boolean) => void', defaultValue: '-' },
  { name: 'open', description: '弹窗打开后触发。', type: '() => void', defaultValue: '-' },
  { name: 'close', description: '弹窗关闭后触发。', type: '() => void', defaultValue: '-' },
  { name: 'scroll', description: '内置滚动区域滚动时触发。', type: '() => void', defaultValue: '-' }
]

const exposeRows: ApiRow[] = [
  { name: 'getScrollbarRef', description: '获取内部 Scrollbar 实例。', type: '() => any', defaultValue: '-' },
  { name: 'scrollTo', description: '滚动到指定位置。', type: '(options?: ScrollToOptions, y?: number) => void', defaultValue: '-' },
  { name: 'scrollTop', description: '设置垂直滚动位置。', type: '(top: number) => void', defaultValue: '-' },
  { name: 'scrollLeft', description: '设置水平滚动位置。', type: '(left: number) => void', defaultValue: '-' }
]

const slotsRows: ApiRow[] = [
  { name: 'default', description: '弹窗主体内容。', type: '() => VNode[]', defaultValue: '-' },
  { name: 'title', description: '自定义标题内容。', type: '() => VNode[]', defaultValue: '-' },
  { name: 'header-actions', description: '标题右侧操作区，位于全屏和关闭按钮之前。', type: '() => VNode[]', defaultValue: '-' },
  { name: 'footer', description: '自定义底部区域；存在时会启用 Arco Modal footer。', type: '() => VNode[]', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'ModalProps', description: 'AbModal 属性类型，继承未被接管的 Arco ModalConfig。', type: 'ModalConfig & { modelValue?; title?; fullscreen?; scrollable?; beforeClose?; ... }', defaultValue: '-' },
  { name: 'ModalConfig', description: '从 Arco ModalConfig 中排除 visible、footer、按钮、关闭和标题等内部接管字段。', type: 'Omit<Partial<ArcoModalConfig>, ModalConfigExcludeKeys>', defaultValue: '-' },
  { name: 'BeforeCloseFn', description: '关闭前回调类型，调用 done 后才会关闭。', type: '(done: () => void) => void', defaultValue: '-' },
  { name: 'ScrollToOptions', description: '内部滚动方法参数类型。', type: 'number | { left?: number; top?: number } | undefined', defaultValue: '-' },
  { name: 'ModalSlots', description: '组件导出的插槽类型。', type: 'default | title | header-actions | footer', defaultValue: '-' }
]
</script>
