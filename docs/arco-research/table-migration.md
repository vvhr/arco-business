# Table 迁移差异报告

## 组件边界

`Table` 已替换为 Arco Design Vue 版本，目录位于 `src/components/Table`。旧 Element Plus 版本已经移除，当前实现不再保留旧表格命名，也不导入旧表格的类型、工具、渲染器和子组件。

本次迁移允许复用项目级通用能力，例如 `format`、`dict`、`copy`、`locale`、`AbIcon`、`AbUpload`。这些能力不属于旧表格实现，因此不会破坏新组件的实现边界。

## 表格属性差异

Element Plus Table 将序号、选择、展开作为 `ElTableColumn` 的 `type` 处理。Arco Table 则把选择、展开、拖拽放在 Table 顶层属性中，分别对应 `rowSelection`、`expandable`、`draggable`。

最终处理方案：

- `columns[].type` 不再支持 `index`、`selection`、`expand`、`radio`。
- 序号列改为顶层 `indexable`，由 Table 自行生成 Arco column。
- 多选和单选改为顶层 `selectable`，内部转换为 `rowSelection`；单选使用 `selectable.type = 'radio'`。
- 展开行改为顶层 `expandable`，内部转换为 `expandedRowRender`。
- 拖拽改为顶层 `draggable`，内部直接转换为 Arco `TableDraggable`。

`TableProps` 默认继承 Arco Table 的公开属性，但排除被组件接管的字段：滚动、分页、虚拟列表、滚动条、合计、选择、展开和拖拽等。`columns`、`pagination`、`expandable` 也由 Table 自身持有，避免未经处理直接透传给 `a-table`。

## 列属性差异

Element Plus 使用 `prop` 和 `label`，Arco 使用 `dataIndex` 和 `title`。Table 继续向业务暴露 `field` 和 `label`，渲染时统一翻译：

- `field -> dataIndex`
- `label -> title`
- `columnAttrs` 只透传未被 Table 接管的 Arco column 属性

Arco 不支持 Element Plus 的 `headerAlign`，因此新类型中移除该属性。业务如果需要控制表头内容，应使用 `headerRender` 或表头插槽。

Arco 将省略和提示拆成 `ellipsis` 与 `tooltip` 两个属性，而 Element Plus 的省略提示是一个整体行为。Table 保留 `ellipsis`，新增 `tooltip`，默认 `tooltip` 跟随 `ellipsis`；显式传 `tooltip: false` 可以只省略不显示提示。

## 自建渲染引擎

Arco column 没有旧表格同语义的 `formatter` 能力。为了保持现有渲染原理，Table 不依赖 Arco 的内置格式化，而是继续自建列渲染链路。

当前保留的业务渲染能力包括：

- `formatter`
- `render`
- `dict`
- `date`
- `amount`
- `sensitive`
- `copyable`
- `clickable`
- `action`
- 编辑态组件渲染

这意味着组件外部仍然通过 TableColumn 描述业务列，内部再转换为 Arco TableColumnData。

## 分页差异

Arco Table 支持内置分页，但 adaptive 场景下表格主体和分页器需要分别占据不同的 flex 区域。Table 因此不使用 `a-table` 内置分页，而是在表格下方渲染独立 `Pagination`。

最终处理方案：

- `page` 和 `pageSize` 由 Table 受控。
- `pagination` 仅作为 Arco Pagination 配置。
- `current`、`defaultCurrent`、`pageSize`、`defaultPageSize`、`total` 从分页器类型中排除，由 Table 统一写入。
- 分页变化同时触发 `update:page`、`update:pageSize` 和 `page-change`。

## 自适应高度

Element Plus Table 可以直接通过高度属性控制表体滚动。Arco Table 的滚动需要 `scroll.y`，并且表格外层必须有确定高度，否则无法撑开表体。

最终处理方案：

- `adaptive = false` 时不设置固定高度，由数据自然撑开表格。
- `adaptive = true` 时，`.ab-table.is-adaptive` 作为 flex 根容器。
- 表格主体包裹在 `.ab-table-body` 内，用于占据分页器之外的剩余空间。
- 内部传给 Arco Table 的 `scroll` 为 `{ y: '100%' }`。
- 分页器作为固定高度区域，不参与表体滚动。

固定高度表格不单独新增 `height` 属性，推荐由外部容器指定高度后开启 `adaptive`，这样可以同时覆盖固定高度和父级自适应两种布局。

## 合计行差异

Element Plus 的 `summaryMethod` 通常返回与列顺序对应的数组。Arco 的 `summary` 需要返回按 `dataIndex` 写值的 summary row 对象数组。

最终处理方案：

- `showSummary` 转换为 Arco Table 的 `summary`。
- `summaryMethod` 改为接收 `{ columns, data }`，返回 `TableData[]`。
- 默认合计逻辑只统计设置了 `summable` 的列。
- 金额列合计会继续使用 `amount` 类型配置格式化。
- `summarySpanMethod` 直接透传为 Arco 的 `summarySpanMethod`。

## 选择、展开与拖拽

Arco 的行选择禁用依赖 `record.disabled`。为了不污染原始业务行，Table 会生成浅层展示记录，并保存 `__abRaw` 指向原始行。所有单元格渲染、选择事件、行点击和拖拽事件都会还原为原始行。

展开行优先使用 `expandable.render(record)`，未提供时使用 `expand` 插槽。拖拽变化时会同时派发 `update:modelValue` 和 `drag-change`，两者都返回原始行数组。

## 编辑态差异

旧表格使用 Element Plus `ElForm` 和 `ElFormItem`，Arco 对应为 `Form` 和 `FormItem`。两者主要差异是字段名和校验返回值。

最终处理方案：

- `ElForm -> Form`
- `ElFormItem -> FormItem`
- `prop -> field`
- `validate()` 根据 Arco 返回的错误对象转换为 `boolean`
- `clearValidate()` 暴露为 `resetValidate()`

编辑组件映射全部切换为 Arco 语义名称，例如 `AutoComplete`、`CheckboxGroup`、`RadioGroup`、`TimePicker`。`TimeSelect` 不再保留，统一使用 `TimePicker`。日期范围不再通过 Element Plus 的 `DatePicker type="daterange"` 表达，Arco 中改用独立的 `RangePicker`，普通 `DatePicker` 始终按单值组件处理。

## 样式差异

样式命名统一从 `ae-*` 迁移为 `ab-*`。Element Plus 相关类名和语义样式不再出现在 Table 内部，表格、分页、表单和标签样式均基于 Arco 的类名与 CSS 变量实现。

## 结论

本次迁移中，结构列迁移到顶层 props、自适应高度增加外层 flex 容器、合计函数返回结构变化，都是 Arco Table API 与 Element Plus Table API 差异导致的必要调整。业务展示、格式化、编辑组件、操作列等能力仍按旧表格的自建渲染引擎思想保留，只做属性翻译和 Arco 组件替换。
