<template>
  <PageHeader
    eyebrow="Components"
    title="AbForm 表单"
    description="Schema 驱动的业务表单组件，用于把布局、输入控件、容器、锚点和自定义渲染组合成稳定的配置化表单。"
    :tags="['Schema driven', 'Anchor form', 'Custom imports']"
  />

  <SectionBlock
    id="form-overview"
    kicker="Overview"
    title="设计目标"
    description="AbForm 面向中后台业务表单，强调 schema 可维护性、布局一致性和局部扩展能力。"
  >
    <FeatureGrid :items="features" />
  </SectionBlock>

  <SectionBlock
    id="form-structure"
    kicker="Structure"
    title="推荐组织方式"
    description="将 schema、默认模型、自定义组件注册和校验行为分开维护，复杂页面会更容易测试和迁移。"
  >
    <div class="docs-callout">
      <pre class="docs-code-inline">const schemas = ref&lt;FormSchema[]&gt;([])
const model = ref&lt;Recordable&gt;({})
const imports: FormImportItem[] = [{ name: 'BusinessField', component: BusinessField }]</pre>
    </div>
  </SectionBlock>

  <DemoBlock
    id="form-basic-demo"
    title="基础输入与布局控制"
    description="展示水平、垂直、行内布局切换，禁用态策略和基础校验。"
    :source="basicSource"
  >
    <BasicDemo />
  </DemoBlock>
  <DemoBlock
    id="form-info-demo"
    title="extra / help 插槽"
    description="通过 formItemProps 与命名插槽补充字段说明，适合业务提示和辅助信息。"
    :source="infoSource"
  >
    <InfoDemo />
  </DemoBlock>
  <DemoBlock
    id="form-anchor-demo"
    title="容器与锚点"
    description="容器 schema 可以配合 scrollRef 创建表单内部锚点导航，适合长表单。"
    :source="anchorSource"
  >
    <AnchorDemo />
  </DemoBlock>
  <DemoBlock
    id="form-custom-demo"
    title="禁用态与嵌套表格"
    description="通过 imports 注入自定义字段组件，覆盖嵌套表格、状态标签和渲染函数组件。"
    :source="editSource"
  >
    <EditDemo />
  </DemoBlock>

  <ApiTable
    id="form-api"
    title="Props API"
    description="常用入参汇总，完整类型以导出的 TypeScript 类型为准。"
    :rows="propsRows"
  />
  <ApiTable
    id="form-events"
    title="Events API"
    description="事件主要用于同步业务状态、监听字段变化和接入页面级行为。"
    :rows="eventsRows"
  />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import FeatureGrid from '@docs/components/FeatureGrid.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/form/basic.vue'
import basicSource from '@docs/demos/form/basic.vue?raw'
import InfoDemo from '@docs/demos/form/info.vue'
import infoSource from '@docs/demos/form/info.vue?raw'
import AnchorDemo from '@docs/demos/form/anchor.vue'
import anchorSource from '@docs/demos/form/anchor.vue?raw'
import EditDemo from '@docs/demos/form/edit.vue'
import editSource from '@docs/demos/form/edit.vue?raw'

const features = [
  { title: '配置驱动', description: '字段、容器、布局和校验规则集中在 schema 中表达。' },
  { title: '局部扩展', description: 'imports 支持按页面注册业务字段组件，不污染全局组件库。' },
  { title: '长表单导航', description: 'anchor 与 scrollRef 可为复杂表单建立内部目录。' }
]

const propsRows: ApiRow[] = [
  { name: 'model', description: '表单数据对象，支持 v-model:model。', type: 'Recordable', defaultValue: '{}' },
  { name: 'schemas', description: '表单 schema 配置。', type: 'FormSchema[]', defaultValue: '[]' },
  { name: 'layout', description: '表单布局。', type: 'horizontal | vertical | inline', defaultValue: 'horizontal' },
  { name: 'imports', description: '局部注册自定义表单组件。', type: 'FormImportItem[]', defaultValue: '[]' },
  { name: 'anchor', description: '是否启用容器锚点导航。', type: 'boolean', defaultValue: 'false' },
  { name: 'disabledStyles', description: '禁用态显示策略。', type: 'FormDisabledStyles', defaultValue: '-' }
]

const eventsRows: ApiRow[] = [
  { name: 'change', description: '字段值变化时触发。', type: '(data: { value; field; oldValue }) => void', defaultValue: '-' },
  { name: 'register', description: '表单实例注册回调。', type: '(formRef: FormInstance) => void', defaultValue: '-' },
  { name: 'init', description: '表单初始化后触发。', type: '(form: Recordable) => void', defaultValue: '-' }
]
</script>
