<template>
  <PageHeader eyebrow="Components" title="AbDrawer 抽屉" description="基于 Arco Drawer 封装，适合详情面板、过滤条件、轻量编辑和跨页面辅助信息。" :tags="['Panel', 'Placement', 'Detail view']" />
  <SectionBlock id="drawer-overview" kicker="Overview" title="选择抽屉的时机" description="当用户需要保留当前页面上下文，又要查看或编辑一段相关信息时，抽屉比整页跳转更合适。" />
  <SectionBlock id="drawer-arco-diff" kicker="Compare" title="与 ADrawer 的核心差异" description="AbDrawer 与 AbModal 保持一致的自建标题栏、右上角工具栏、自定义 footer、内置滚动和 beforeClose 拦截，但不提供全屏切换，更适合保持当前页面上下文的侧边工作流。" />
  <DemoBlock id="drawer-basic-demo" title="不同方向抽屉" description="展示右侧详情抽屉和底部辅助抽屉。" :source="source">
    <BasicDemo />
  </DemoBlock>
  <DemoBlock id="drawer-advanced-demo" title="自适应滚动与关闭拦截" description="展示 header-actions、footer、scrollable 内容区和 beforeClose 拦截。" :source="advancedSource">
    <AdvancedDemo />
  </DemoBlock>
  <ApiTable id="drawer-api" title="Props API" description="AbDrawer 的核心配置集中在显示状态、方向、标题和滚动策略。" :rows="propsRows" />
  <ApiTable id="drawer-events" title="Events API" description="事件用于同步显示状态、监听打开关闭和内部滚动。" :rows="eventsRows" />
  <ApiTable id="drawer-expose" title="Expose API" description="启用 scrollable 后可通过实例方法控制内部滚动条。" :rows="exposeRows" />
  <ApiTable id="drawer-slots" title="Slots API" description="插槽用于替换标题、补充标题操作区和自定义底部区域。" :rows="slotsRows" />
  <ApiTable id="drawer-types" title="Types API" description="Drawer 类型在 Arco DrawerConfig 基础上排除了由 AbDrawer 接管的字段。" :rows="typesRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/drawer/basic.vue'
import source from '@docs/demos/drawer/basic.vue?raw'
import AdvancedDemo from '@docs/demos/drawer/advanced.vue'
import advancedSource from '@docs/demos/drawer/advanced.vue?raw'

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '显示状态，支持 v-model。', type: 'boolean', defaultValue: 'false' },
  { name: 'title', description: '标题文本。', type: 'string', defaultValue: '-' },
  { name: 'header', description: '是否显示头部。', type: 'boolean', defaultValue: 'true' },
  { name: 'placement', description: '抽屉方向。', type: 'top | right | bottom | left', defaultValue: 'right' },
  { name: 'width', description: '左右抽屉宽度，继承 Arco Drawer 配置。', type: 'string | number', defaultValue: '500px' },
  { name: 'height', description: '上下抽屉高度，继承 Arco Drawer 配置。', type: 'string | number', defaultValue: '250px' },
  { name: 'mask', description: '是否显示遮罩。', type: 'boolean', defaultValue: 'true' },
  { name: 'unmountOnClose', description: '关闭后是否卸载内容。', type: 'boolean', defaultValue: 'true' },
  { name: 'maskClosable', description: '点击遮罩是否关闭。', type: 'boolean', defaultValue: 'false' },
  { name: 'renderToBody', description: '是否挂载到 body。', type: 'boolean', defaultValue: 'true' },
  { name: 'bodyClass', description: '抽屉主体类名。', type: 'string | any[] | Record<string, boolean>', defaultValue: "''" },
  { name: 'escToClose', description: '是否允许 Esc 关闭。', type: 'boolean', defaultValue: 'false' },
  { name: 'scrollable', description: '是否启用内置滚动区域。', type: 'boolean', defaultValue: 'false' },
  { name: 'scrollbarType', description: 'Arco Scrollbar 类型。', type: 'track | embed', defaultValue: 'embed' },
  { name: 'scrollbarOuterClass', description: '滚动条外层类名。', type: 'string | Record<string, boolean> | any[]', defaultValue: "''" },
  { name: 'scrollbarOuterStyle', description: '滚动条外层样式。', type: 'string | CSSProperties', defaultValue: 'height: 100%' },
  { name: 'bodyStyle', description: '抽屉主体样式，兼容 Arco bodyStyle。', type: 'string | CSSProperties', defaultValue: '-' },
  { name: 'beforeClose', description: '关闭前回调。', type: '(done: () => void) => void', defaultValue: '-' }
]

const eventsRows: ApiRow[] = [
  { name: 'update:modelValue', description: '显示状态变化时触发。', type: '(visible: boolean) => void', defaultValue: '-' },
  { name: 'open', description: '抽屉打开后触发。', type: '() => void', defaultValue: '-' },
  { name: 'close', description: '抽屉关闭后触发。', type: '() => void', defaultValue: '-' },
  { name: 'scroll', description: '内置滚动区域滚动时触发。', type: '() => void', defaultValue: '-' }
]

const exposeRows: ApiRow[] = [
  { name: 'getScrollbarRef', description: '获取内部 Scrollbar 实例。', type: '() => any', defaultValue: '-' },
  { name: 'scrollTo', description: '滚动到指定位置。', type: '(options?: ScrollToOptions, y?: number) => void', defaultValue: '-' },
  { name: 'scrollTop', description: '设置垂直滚动位置。', type: '(top: number) => void', defaultValue: '-' },
  { name: 'scrollLeft', description: '设置水平滚动位置。', type: '(left: number) => void', defaultValue: '-' }
]

const slotsRows: ApiRow[] = [
  { name: 'default', description: '抽屉主体内容。', type: '() => VNode[]', defaultValue: '-' },
  { name: 'title', description: '自定义标题内容。', type: '() => VNode[]', defaultValue: '-' },
  { name: 'header-actions', description: '标题右侧操作区，位于关闭按钮之前。', type: '() => VNode[]', defaultValue: '-' },
  { name: 'footer', description: '自定义底部区域；存在时会启用 Arco Drawer footer。', type: '() => VNode[]', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'DrawerProps', description: 'AbDrawer 属性类型，继承未被接管的 Arco DrawerConfig。', type: 'DrawerConfig & { modelValue?; title?; header?; placement?; scrollable?; beforeClose?; ... }', defaultValue: '-' },
  { name: 'DrawerConfig', description: '从 Arco DrawerConfig 中排除 visible、footer、按钮、关闭和标题等内部接管字段。', type: 'Omit<Partial<ArcoDrawerConfig>, ModalConfigExcludeKeys>', defaultValue: '-' },
  { name: 'BeforeCloseFn', description: '关闭前回调类型，调用 done 后才会关闭。', type: '(done: () => void) => void', defaultValue: '-' },
  { name: 'ScrollToOptions', description: '内部滚动方法参数类型。', type: 'number | { left?: number; top?: number } | undefined', defaultValue: '-' },
  { name: 'DrawerSlots', description: '组件导出的插槽类型。', type: 'default | title | header-actions | footer', defaultValue: '-' }
]
</script>
