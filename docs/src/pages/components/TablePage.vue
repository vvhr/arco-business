<template>
  <PageHeader
    eyebrow="Components"
    title="AbTable 表格"
    description="面向业务列表、编辑表格和数据录入场景的高级表格组件，封装选择列、展开列、合计行、格式化和操作列。"
    :tags="['Editable table', 'Selection', 'Summary row']"
  />

  <SectionBlock
    id="table-overview"
    kicker="Overview"
    title="适用场景"
    description="AbTable 适合中后台中高频出现的业务列表和行内编辑场景，避免每个页面重复组合 Arco Table、Form 和操作列。"
  >
    <FeatureGrid :items="features" />
  </SectionBlock>

  <SectionBlock
    id="table-model"
    kicker="Model"
    title="核心数据模型"
    description="列配置是表格能力入口，行数据通过 v-model 进入组件，页面级上下文通过 form、dict 和 excontext 注入。"
  >
    <div class="docs-callout">
      <pre class="docs-code-inline">&lt;AbTable
  v-model="rows"
  :columns="columns"
  :form="form"
  :dict="dict"
  :excontext="pageContext"
/&gt;</pre>
    </div>
  </SectionBlock>

  <DemoBlock id="table-basic-demo" title="基础分页与序号列" description="展示分页、序号列和基础字典格式化。" :source="basicSource">
    <BasicDemo />
  </DemoBlock>
  <DemoBlock id="table-selection-demo" title="多选列与外部控制" description="选择列可由组件内部维护，也可以通过实例方法进行外部控制。" :source="selectionSource">
    <SelectionDemo />
  </DemoBlock>
  <DemoBlock id="table-tree-demo" title="树形数据与展开列" description="树形数据和展开内容覆盖组织结构、明细行和轻量详情面板。" :source="treeExpandSource">
    <TreeExpandDemo />
  </DemoBlock>
  <DemoBlock id="table-layout-demo" title="固定高度与自适应高度" description="通过容器高度约束验证滚动区域和分页区域不会被文档样式覆盖。" :source="layoutSource">
    <LayoutDemo />
  </DemoBlock>
  <DemoBlock id="table-summary-demo" title="合计行" description="合计行可与普通表格和选择列共存，用于金额、数量等列汇总。" :source="summarySource">
    <SummaryDemo />
  </DemoBlock>
  <DemoBlock id="table-edit-demo" title="编辑表格与操作列" description="编辑列、校验和内置操作列组合，覆盖常见可编辑列表场景。" :source="editableActionSource">
    <EditableActionDemo />
  </DemoBlock>

  <ApiTable id="table-api" title="Props API" description="表格入参围绕数据、列配置、选择、编辑、分页和布局组织。" :rows="propsRows" />
  <ApiTable id="table-events" title="Events API" description="事件用于接入页面查询、行操作、选择结果和拖拽结果。" :rows="eventsRows" />
</template>

<script setup lang="ts">
import PageHeader from '@docs/components/PageHeader.vue'
import DemoBlock from '@docs/components/DemoBlock.vue'
import ApiTable from '@docs/components/ApiTable.vue'
import SectionBlock from '@docs/components/SectionBlock.vue'
import FeatureGrid from '@docs/components/FeatureGrid.vue'
import type { ApiRow } from '@docs/components/types'
import BasicDemo from '@docs/demos/table/basic.vue'
import basicSource from '@docs/demos/table/basic.vue?raw'
import SelectionDemo from '@docs/demos/table/selection.vue'
import selectionSource from '@docs/demos/table/selection.vue?raw'
import TreeExpandDemo from '@docs/demos/table/tree-expand.vue'
import treeExpandSource from '@docs/demos/table/tree-expand.vue?raw'
import LayoutDemo from '@docs/demos/table/layout.vue'
import layoutSource from '@docs/demos/table/layout.vue?raw'
import SummaryDemo from '@docs/demos/table/summary.vue'
import summarySource from '@docs/demos/table/summary.vue?raw'
import EditableActionDemo from '@docs/demos/table/editable-action.vue'
import editableActionSource from '@docs/demos/table/editable-action.vue?raw'

const features = [
  { title: '列配置集中', description: '显示、格式化、编辑、合计和操作行为都由 columns 描述。' },
  { title: '编辑能力内建', description: '行内编辑复用表单组件注册体系，降低表格录入页成本。' },
  { title: '布局可验证', description: '固定高度、自适应高度和分页区域在文档站中独立验证。' }
]

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '表格数据，支持 v-model。', type: 'Recordable[]', defaultValue: '[]' },
  { name: 'columns', description: '业务列配置。', type: 'TableColumn[]', defaultValue: '[]' },
  { name: 'selectable', description: '选择列配置，支持 checkbox/radio。', type: 'boolean | TableColumnSelect', defaultValue: 'false' },
  { name: 'editable', description: '是否启用编辑表格。', type: 'boolean', defaultValue: 'false' },
  { name: 'adaptive', description: '是否根据容器高度自适应滚动区域。', type: 'boolean', defaultValue: 'false' },
  { name: 'pagination', description: '分页配置。', type: 'false | TablePagination', defaultValue: 'false' }
]

const eventsRows: ApiRow[] = [
  { name: 'selection-change', description: '选择结果变化。', type: '(rows: Recordable[]) => void', defaultValue: '-' },
  { name: 'page-change', description: '分页变化。', type: '(value: { page; pageSize }) => void', defaultValue: '-' },
  { name: 'action', description: '内置操作列按钮点击。', type: '(event: { name; row; index }) => void', defaultValue: '-' },
  { name: 'drag-change', description: '拖拽排序结果变化。', type: '(rows: Recordable[]) => void', defaultValue: '-' }
]
</script>
