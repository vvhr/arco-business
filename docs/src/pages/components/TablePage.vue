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

  <SectionBlock
    id="table-arco-diff"
    kicker="Compare"
    title="与 Arco Table 的核心差异"
    description="AbTable 保留 Arco Table 的原生属性透传，同时把中后台高频的列模型、编辑表格、业务格式化、操作列和独立分页收敛到 TableColumn 配置。"
  >
    <FeatureGrid :items="diffFeatures" />
  </SectionBlock>

  <DemoBlock id="table-basic-demo" title="基础分页与内置格式化" description="展示分页、序号列、字典、日期、金额、脱敏和合计能力。" :source="basicSource">
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
  <DemoBlock id="table-dynamic-demo" title="动态编辑、权限与操作列" description="展示 TableColumnFn、autoRules、componentEvent、excontext、可点击单元格和动态操作按钮。" :source="dynamicEditingSource">
    <DynamicEditingDemo />
  </DemoBlock>

  <ApiTable id="table-api" title="Props API" description="表格入参围绕数据、列配置、选择、编辑、分页和布局组织。" :rows="propsRows" />
  <ApiTable id="table-events" title="Events API" description="事件用于接入页面查询、行操作、选择结果和拖拽结果。" :rows="eventsRows" />
  <ApiTable id="table-expose" title="Expose API" description="表格实例方法用于外部控制选择态和编辑校验。" :rows="exposeRows" />
  <ApiTable id="table-types" title="Types API" description="表格没有导出名为 TableSchema 的类型，公开的表格 schema 类型是 TableColumn。" :rows="typesRows" />
  <ApiTable id="table-type-column" title="TableColumn 类型" description="TableColumn 是 AbTable 的列 schema，负责显示、格式化、编辑、合计和交互行为。" :rows="columnRows" />
  <ApiTable id="table-type-column-type-props" title="TableColumnTypeProps 类型" description="业务列类型的附加配置，覆盖操作列、字典列、日期、金额和脱敏展示。" :rows="typePropsRows" />
  <ApiTable id="table-type-edit-props" title="TableColumnEditProps 类型" description="编辑列通过 editProps 描述组件、校验、事件、动态属性和内部插槽。" :rows="editPropsRows" />
  <ApiTable id="table-type-action" title="TableAction 类型" description="操作列按钮可以静态配置，也可以通过 TableColumnFn 读取行、form、excontext 后动态生成。" :rows="actionRows" />
  <ApiTable id="table-type-structure" title="结构列类型" description="序号、选择、展开和拖拽已从列 type 迁移为顶层 props，以便与 Arco Table 的结构能力更稳定地映射。" :rows="structureRows" />
  <ApiTable id="table-type-edit-component" title="TableFormComponentProps 类型" description="编辑组件属性支持 options 函数、disabled 函数和 vBinds 扩展绑定。" :rows="editComponentRows" />
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
import DynamicEditingDemo from '@docs/demos/table/dynamic-editing.vue'
import dynamicEditingSource from '@docs/demos/table/dynamic-editing.vue?raw'

const features = [
  { title: '列配置集中', description: '显示、格式化、编辑、合计和操作行为都由 columns 描述。' },
  { title: '编辑能力内建', description: '行内编辑复用表单组件注册体系，降低表格录入页成本。' },
  { title: '布局可验证', description: '固定高度、自适应高度和分页区域在文档站中独立验证。' }
]

const diffFeatures = [
  { title: '业务列模型', description: 'TableColumn 将 field、label、formatter、render、editProps 和 typeProps 组合成页面可复用配置。' },
  { title: '编辑表格内建', description: '编辑态复用 Form 的校验规则和组件注册思路，支持行级动态禁用、事件和校验。' },
  { title: '操作列可配置', description: 'TableAction 支持按钮、下拉、权限、加载态和隐藏逻辑，不再在每个页面重复写 JSX。' }
]

const propsRows: ApiRow[] = [
  { name: 'modelValue', description: '表格数据，支持 v-model。', type: 'Recordable[]', defaultValue: '[]' },
  { name: 'columns', description: '业务列配置。', type: 'TableColumn[]', defaultValue: '[]' },
  { name: 'form', description: '传给列函数和编辑组件的页面级表单模型。', type: 'Recordable', defaultValue: '{}' },
  { name: 'excontext', description: '传给列函数、渲染函数和事件函数的外部上下文。', type: 'Recordable', defaultValue: '{}' },
  { name: 'dict', description: '字典数据集合，配合 dict 类型列使用。', type: 'DictMap', defaultValue: '{}' },
  { name: 'editable', description: '是否启用编辑表格。', type: 'boolean', defaultValue: 'false' },
  { name: 'disabled', description: '是否禁用编辑态下的单元格输入组件。', type: 'boolean', defaultValue: 'false' },
  { name: 'page', description: '当前页码，配合独立分页器使用。', type: 'number', defaultValue: '1' },
  { name: 'pageSize', description: '每页条数，也用于序号列跨页计算。', type: 'number', defaultValue: '10' },
  { name: 'total', description: '分页总条数。', type: 'number', defaultValue: '0' },
  { name: 'ellipsis', description: '全局单元格省略配置，可被列级配置覆盖。', type: 'boolean', defaultValue: 'false' },
  { name: 'pagination', description: '独立分页器配置，false/null 时不渲染分页器。', type: 'false | null | TablePagination', defaultValue: 'undefined' },
  { name: 'loading', description: '加载态，兼容 Arco Table loading 配置。', type: 'boolean | Record<string, any>', defaultValue: 'false' },
  { name: 'align', description: '默认列对齐方式。', type: 'left | center | right', defaultValue: 'left' },
  { name: 'size', description: '表格尺寸，继承 Arco Table 尺寸语义。', type: 'mini | small | medium | large', defaultValue: 'medium' },
  { name: 'rowKey', description: '行主键字段，用于选择、展开和拖拽定位。', type: 'string', defaultValue: 'id' },
  { name: 'emptyValue', description: '空值展示文本。', type: 'string', defaultValue: '-' },
  { name: 'adaptive', description: '是否根据父级高度自适应滚动区域。', type: 'boolean', defaultValue: 'false' },
  { name: 'showSummary', description: '是否显示合计行。', type: 'boolean', defaultValue: 'false' },
  { name: 'summaryMethod', description: '自定义合计数据生成函数。', type: '(param: TableSummaryParams) => TableData[]', defaultValue: 'null' },
  { name: 'summarySpanMethod', description: '合计行单元格合并函数。', type: '(data: TableSummarySpanParams) => { rowspan?; colspan? } | void', defaultValue: '-' },
  { name: 'freshKey', description: '强制刷新表格的 key。', type: 'number', defaultValue: '0' },
  { name: 'imports', description: '编辑组件局部注册配置。', type: 'TableFormImportItem[]', defaultValue: '[]' },
  { name: 'indexable', description: '序号列配置，true 使用默认序号列。', type: 'boolean | TableColumnIndex', defaultValue: 'false' },
  { name: 'selectable', description: '选择列配置，支持 checkbox/radio。', type: 'boolean | TableColumnSelect', defaultValue: 'false' },
  { name: 'expandable', description: '展开列配置，未传 render 时使用 expand 插槽。', type: 'TableColumnExpand', defaultValue: '-' },
  { name: 'draggable', description: '拖拽列配置，true 使用默认拖拽手柄。', type: 'boolean | TableColumnDraggable', defaultValue: 'false' }
]

const eventsRows: ApiRow[] = [
  { name: 'update:modelValue', description: '表格数据变化时触发。', type: '(value: Recordable[]) => void', defaultValue: '-' },
  { name: 'update:editable', description: '编辑态变化时触发。', type: '(value: boolean) => void', defaultValue: '-' },
  { name: 'update:page', description: '当前页码变化时触发。', type: '(value: number) => void', defaultValue: '-' },
  { name: 'update:pageSize', description: '每页条数变化时触发。', type: '(value: number) => void', defaultValue: '-' },
  { name: 'register', description: '表格原始实例注册回调。', type: '(tableRef: TableRawInstance | undefined) => void', defaultValue: '-' },
  { name: 'selection-change', description: '选择结果变化。', type: '(rows: Recordable[]) => void', defaultValue: '-' },
  { name: 'page-change', description: '分页变化。', type: '(value: { page; pageSize }) => void', defaultValue: '-' },
  { name: 'current-change', description: '当前行变化。', type: '(currentRow: Recordable) => void', defaultValue: '-' },
  { name: 'row-click', description: '行点击事件。', type: '(row: Recordable) => void', defaultValue: '-' },
  { name: 'value-click', description: '可点击单元格值被点击。', type: '(key: string, row: Recordable) => void', defaultValue: '-' },
  { name: 'action', description: '内置操作列按钮点击。', type: '(event: { name; row; index }) => void', defaultValue: '-' },
  { name: 'drag-change', description: '拖拽排序结果变化。', type: '(rows: Recordable[]) => void', defaultValue: '-' }
]

const exposeRows: ApiRow[] = [
  { name: 'updateSelections', description: '按原始行对象更新选中态。', type: '(rows: Recordable[]) => void', defaultValue: '-' },
  { name: 'updateSelectionKeys', description: '按 rowKey 主键数组更新选中态。', type: '(keys: (string | number)[]) => void', defaultValue: '-' },
  { name: 'validate', description: '校验编辑态表格，非编辑态直接返回 true。', type: '() => Promise<boolean>', defaultValue: '-' },
  { name: 'resetValidate', description: '清空编辑表格的 Arco Form 校验状态。', type: '() => void', defaultValue: '-' }
]

const typesRows: ApiRow[] = [
  { name: 'TableColumn', description: '表格列 schema 类型，描述字段、标题、渲染、编辑、合计和操作行为。', type: '{ field?; key?; label?; type?; render?; editProps?; children?; ... }', defaultValue: '-' },
  { name: 'TableColumnType', description: '内置业务列类型。', type: 'default | action | dict | date | amount | sensitive', defaultValue: '-' },
  { name: 'TableColumnTypeProps', description: '业务列附加配置，覆盖操作列、字典列、日期、金额和脱敏展示。', type: '{ actions?; dictName?; dateFormat?; amountDigits?; sensitiveType?; ... }', defaultValue: '-' },
  { name: 'TableColumnEditProps', description: '编辑列配置，描述编辑组件、默认值、校验和内部插槽。', type: '{ field?; component?; componentProps?; componentEvent?; formItemProps?; insideProps? }', defaultValue: '-' },
  { name: 'TableAction', description: '操作列按钮配置。', type: '{ label; name; icon?; dropdown?; event?; loading?; disabled?; hidden?; buttonAttrs? }', defaultValue: '-' },
  { name: 'TableColumnSelect', description: '选择列配置，会转换为 Arco rowSelection。', type: 'Omit<TableRowSelection, "title" | "width"> & { label?; width?; selectable? }', defaultValue: '-' },
  { name: 'TableColumnExpand', description: '展开列配置，会转换为 Arco expandable.expandedRowRender。', type: 'Omit<TableExpandable, ...> & { label?; width?; render? }', defaultValue: '-' },
  { name: 'TableColumnDraggable', description: '拖拽列配置，会转换为 Arco draggable。', type: 'Omit<TableDraggable, "title" | "width"> & { label?; width? }', defaultValue: '-' },
  { name: 'TablePagination', description: '独立分页器配置，current、pageSize 和 total 由 AbTable 接管。', type: 'Omit<PaginationProps, "current" | "pageSize" | "total"> & { total?: number }', defaultValue: '-' },
  { name: 'TableColumnFn<T>', description: '列级动态函数统一签名。', type: '(row, index, column, form, excontext, editable) => T', defaultValue: '-' },
  { name: 'TableRawInstance', description: 'Arco Table 原始实例能力的最小暴露类型。', type: '{ select?; selectAll?; expand?; expandAll?; resetFilters?; clearFilters?; resetSorters?; clearSorters? }', defaultValue: '-' }
]

const columnRows: ApiRow[] = [
  { name: 'field / key', description: '字段路径和列唯一 key，操作列或分组列可只配置 key。', type: 'string', defaultValue: '-' },
  { name: 'label / subLabel', description: '列标题和表头副标题。', type: 'string', defaultValue: '-' },
  { name: 'hidden / visible', description: '列显隐控制，hidden 支持 TableColumnFn 动态判断。', type: 'boolean | TableColumnFn<boolean>', defaultValue: 'false' },
  { name: 'children', description: '子列配置，用于多级表头。', type: 'TableColumn[]', defaultValue: '[]' },
  { name: 'type / typeProps', description: '业务列类型及其附加配置。', type: 'TableColumnType / TableColumnTypeProps', defaultValue: 'default' },
  { name: 'formatter / render', description: '单元格格式化或完整自定义渲染。', type: 'TableColumnFn<string | number | VNode>', defaultValue: '-' },
  { name: 'ellipsis / tooltip', description: '单元格省略和 tooltip 展示策略。', type: 'boolean | Record<string, any>', defaultValue: '-' },
  { name: 'copyable / clickable', description: '是否展示复制按钮或允许点击单元格值。', type: 'boolean | TableColumnFn<boolean>', defaultValue: 'false' },
  { name: 'editProps', description: '编辑态组件配置。', type: 'TableColumnEditProps', defaultValue: '-' },
  { name: 'summable / summaryMethod', description: '是否参与默认合计及列级合计函数。', type: 'boolean / (values) => string | number | VNode', defaultValue: 'false' }
]

const typePropsRows: ApiRow[] = [
  { name: 'actions / actionDropdown', description: '操作列按钮集合或动态按钮函数，以及更多按钮配置。', type: 'TableAction[] | TableColumnFn<TableAction[]>', defaultValue: '[]' },
  { name: 'dictName / dictOptions', description: '字典列的数据来源。', type: 'string / DictItem[]', defaultValue: '-' },
  { name: 'dictViewType', description: '字典展示形态。', type: 'tag | text | dot-tag', defaultValue: 'text' },
  { name: 'dictViewRender', description: '自定义字典展示渲染函数。', type: '(originValue, value, option) => VNode | string', defaultValue: '-' },
  { name: 'dateFormat', description: '日期列格式化模板。', type: 'string', defaultValue: '-' },
  { name: 'amountThousand / amountDigits / amountUnit', description: '金额列千分位、小数位和单位设置。', type: 'boolean / number / string', defaultValue: '-' },
  { name: 'sensitiveType / sensitiveRegex', description: '脱敏列内置类型或自定义脱敏正则。', type: 'phone | idCard | email / [RegExp | string, string]', defaultValue: '-' }
]

const editPropsRows: ApiRow[] = [
  { name: 'field', description: '编辑字段路径，默认使用 column.field。', type: 'string', defaultValue: 'column.field' },
  { name: 'component', description: '编辑组件名，内置支持常用 Arco 输入组件，也可通过 imports 注册。', type: 'TableFormComponentName | string', defaultValue: 'Input' },
  { name: 'defaultValue', description: '默认值，保留给外部初始化逻辑使用。', type: 'any', defaultValue: '-' },
  { name: 'componentProps', description: '传给编辑组件的属性。', type: 'TableFormComponentProps', defaultValue: '{}' },
  { name: '_v_componentProps', description: '动态组件属性函数。', type: 'TableColumnFn<Recordable>', defaultValue: '-' },
  { name: 'componentEvent', description: '编辑组件事件映射。', type: 'TableFormComponentEvents', defaultValue: '{}' },
  { name: 'formItemProps.rules', description: 'Arco FieldRule 校验规则。', type: 'FieldRule | FieldRule[]', defaultValue: '[]' },
  { name: 'formItemProps.autoRules', description: '自动校验规则名。', type: 'TableFormAutoRules[]', defaultValue: '[]' },
  { name: 'insideProps.renders', description: '编辑组件内部插槽渲染集合。', type: 'TableFormInsidePropsRenders', defaultValue: '{}' }
]

const actionRows: ApiRow[] = [
  { name: 'label / name', description: '按钮文本和事件名称。', type: 'string', defaultValue: '-' },
  { name: 'icon / noIcon / noLabel', description: '按钮图标和图文显示控制。', type: 'string / boolean', defaultValue: '-' },
  { name: 'type', description: '按钮强调级别。', type: 'primary | second | ""', defaultValue: '""' },
  { name: 'dropdown', description: '是否进入更多菜单。', type: 'always | auto | never', defaultValue: 'auto' },
  { name: 'event', description: '按钮点击业务回调。', type: 'TableColumnFn<void>', defaultValue: '-' },
  { name: 'loading / disabled / hidden', description: '按钮加载、禁用和隐藏状态，支持按行动态判断。', type: 'TableColumnFn<boolean> | boolean', defaultValue: 'false' },
  { name: 'buttonAttrs', description: '透传给 Arco Button 的属性。', type: 'ButtonProps & Recordable', defaultValue: '{}' }
]

const structureRows: ApiRow[] = [
  { name: 'TableColumnIndex', description: '序号列配置。', type: '{ label?; width?; minWidth?; fixed?; align? }', defaultValue: '-' },
  { name: 'TableColumnSelect', description: '选择列配置，转换为 Arco rowSelection。', type: 'Omit<TableRowSelection, "title" | "width"> & { selectable? }', defaultValue: '-' },
  { name: 'TableColumnExpand', description: '展开列配置，未传 render 时使用 expand 插槽。', type: 'Omit<TableExpandable, ...> & { render? }', defaultValue: '-' },
  { name: 'TableColumnDraggable', description: '拖拽列配置，转换为 Arco draggable。', type: 'Omit<TableDraggable, "title" | "width">', defaultValue: '-' }
]

const editComponentRows: ApiRow[] = [
  { name: 'freshKey', description: '强制刷新编辑组件实例。', type: 'string | number', defaultValue: '-' },
  { name: 'disabled', description: '编辑组件禁用态，支持按行动态判断。', type: 'boolean | TableColumnFn<boolean>', defaultValue: 'false' },
  { name: 'allowClear', description: '清空按钮开关。', type: 'boolean', defaultValue: 'true' },
  { name: 'options', description: '选择类组件选项，支持读取 row、form、excontext。', type: 'any[] | TableColumnFn<any[]>', defaultValue: '[]' },
  { name: 'fieldNames', description: 'Arco 选项字段映射。', type: 'TableOptionKeys', defaultValue: '{}' },
  { name: 'vBinds', description: '扩展 v-model 绑定字段映射。', type: 'Record<string, string>', defaultValue: '{}' },
  { name: 'placeholder / style', description: '编辑组件占位文案和样式。', type: 'string | string[] / CSSProperties', defaultValue: '-' }
]
</script>
