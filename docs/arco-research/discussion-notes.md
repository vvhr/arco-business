# Arco Design Version Discussion Notes

日期：2026-05-29

## 背景

当前项目是基于 Vue 3 + Element Plus 的配置驱动型高级组件库。新目标是调研并规划一个基于 Arco Design Vue 的独立版本。

核心约束：

- 新版本与当前项目完全独立，使用独立仓库、独立包名、独立发布流程。
- 不建设 `shared` 包，不在两个项目之间维持公共代码依赖。
- 当前项目作为行为参考和种子代码来源，新项目可以复制代码后独立演进。
- 前期重点不是普通组件替换，而是验证 `Form` 和 `Table` 的深度封装能否迁移。

## 已确认方向

### 独立项目

不采用 monorepo/shared 方案。推荐新建独立仓库，例如 `advanced-arco-ui`。

理由：

- 避免 Element Plus 版本和 Arco 版本互相牵制。
- 降低重构当前稳定版本的风险。
- 新项目可以围绕 Arco 的 API 和行为模型重新组织内部实现。
- Agent 后续主要在新仓库工作，当前仓库只作为参考源。

### Form 是第一优先级风险点

当前 `Form` 不是简单封装输入组件，而是深度扩展了 `ElForm` 和 `ElFormItem`：

- schema 驱动渲染。
- `model`、字段路径、默认值初始化。
- `formItemProps`、自动 rules、required 状态。
- `validate`、`resetValidate`、错误滚动。
- label、布局、禁用态、描述模式。
- 外部 prepend/append、内部 slots/renders。
- 与高级 `Table` 的嵌套联动。

Arco Vue Form 需要重点验证：

- `field` 是否能完整替代 Element Plus 的 `prop`。
- 嵌套路径、数组路径和动态表格编辑路径是否稳定。
- rules 类型、触发方式、错误结构是否需要转换。
- `validate`、`validateField`、`resetFields`、`clearValidate`、`scrollToField` 的行为差异。
- FormItem slot/label/help/extra 能否承载当前扩展。

初步判断：`Form` 功能面大概率可迁移，但 rules、错误结构、FormItem props 命名需要重写适配。

### Table 不能走官方 columns 模式

当前 `Table` 的核心不是简单 columns 配置，而是自建 `TableColumn` DSL：

- 普通列、index、selection、radio、expand、action。
- dict、formatter、emptyValue、ellipsis、clickable。
- sensitive 脱敏显示。
- custom slot/render。
- editable 单元格。
- 自动 placeholder、options、vBinds、dynamic componentProps。
- form/excontext/editable 上下文注入。
- autoRules 和单元格 FormItem 校验。

Arco Table 的 `columns` 模式适合普通业务表格，但 API 面有限。若强行把当前 `TableColumn[]` 转成 Arco `TableColumnData[]`，会形成厚重且受限的 adapter。

因此 Arco 版 Table 仍应采用 template/子列模式，自建 TableColumn 渲染体系：

```tsx
<ATable data={props.modelValue} {...tableAttrs}>
  {{
    default: () => renderAdvancedColumns(...)
  }}
</ATable>
```

底层可以生成 Arco 的 `TableColumn` 子组件，但项目自身的列协议不能退化成 Arco 官方 `columns`。

### Arco Table 的角色边界

Arco Table 主要作为底层表格容器：

- 表格结构。
- 滚动、固定列、边框、loading。
- 可复用的 selection/expand 基础能力。
- 表格事件分发。

高级组件库自身继续负责：

- `TableColumn[]` 协议。
- 列类型体系。
- 单元格渲染 pipeline。
- editable 单元格。
- 字典、脱敏、空值、点击、动态 props。
- FormItem 校验包装。
- 与高级 Form 的嵌套联动。

## 当前风险判断

### 高风险

- Arco `TableColumn` slot 模型是否能完整承载当前 `ElTableColumn` 的动态 TSX 生成方式。
- editable 单元格中嵌套 Arco `FormItem` 后，字段路径、校验、分页、排序、虚拟滚动是否稳定。
- selection/radio/expand 是否复用 Arco 内置能力，还是全部自建列。

### 中风险

- Form rules 类型从 Element Plus `FormItemRule` 迁移到 Arco `FieldRule`。
- `validate` 返回值和错误对象结构变化。
- Pagination API 差异，尤其是当前 `page/pageSize/total` 双向绑定语义。
- loading 指令从 Element Plus `vLoading` 改为 Arco loading 方案。

### 低风险

- 普通输入组件映射。
- placeholder、clearable、options 的基础适配。
- i18n、dict、format、tree、set/get 等非 UI 工具迁移。

## 建议的调研 Spike

首轮 spike 只验证关键路径，不追求完整组件库：

1. Arco Form schema 渲染 `Input`、`Select`、`DatePicker`。
2. Arco Form 校验、清校验、滚动错误字段。
3. Arco Table 使用 template/子列模式动态生成多个 `TableColumn`。
4. Arco Table `cell` slot 获取 `record`、`column`、`rowIndex` 的稳定性。
5. Arco Table editable 单元格内嵌 `FormItem` 并完成校验。
6. selection、radio、expand 三类特殊列分别验证复用内置能力和自建列的可行性。

## 参考资料

- Arco Design Vue 仓库：https://github.com/arco-design/arco-design-vue
- Arco Vue Form 文档：https://raw.githubusercontent.com/arco-design/arco-design-vue/main/packages/web-vue/components/form/README.zh-CN.md
- Arco Vue Table 文档：https://raw.githubusercontent.com/arco-design/arco-design-vue/main/packages/web-vue/components/table/README.zh-CN.md
- Arco Vue TableColumn 源码：https://raw.githubusercontent.com/arco-design/arco-design-vue/main/packages/web-vue/components/table/table-column.tsx

## 待继续讨论

- 新包命名、组件前缀是否沿用 `Ae`。
- 新项目是否从当前仓库复制后删改，还是用 Vite library template 重建后搬迁模块。
- 首版支持范围：是否只覆盖 `Form`、`Table`、`Text`、`Icon`、`Upload`。
- `selection`、`radio`、`expand` 在 Arco Table 下的最终实现策略。
- 是否需要保留当前 Element Plus 版完全一致的 schema API，还是允许 Arco 版做少量破坏性调整。

## 2026-05-29 差异分析：Form 和 Table 深层 API

### Form：Element Plus `prop` 到 Arco `field`

当前实现中 `useFormItem` 给 `ElFormItem` 传入 `prop: schema.field`，并把 `rules` 合并到表单项上。Arco `FormItem` 使用 `field` 表示字段路径，不使用 `prop`。

判断：

- 字段路径语义基本可迁移，Arco 明确支持 `people.2.id` 和 `people[2].id`。
- `getFormItemProps()` 需要做完整重写，至少把 `prop` 转为 `field`。
- 当前 `formItemProps` 如果允许用户直接传 Element Plus 原生属性，则 Arco 版不能完全兼容，需要建立 Arco 版 `formItemProps` 类型。

需要确认：

- Arco 版是否仍保留配置字段名 `formItemProps`，但其内部语义改为 Arco `FormItem` props？
- 是否需要提供兼容层，把常见 Element Plus props 转为 Arco props，例如 `prop -> field`？

### Form：校验规则和错误结构

当前 `autoRules` 生成的是 Element Plus 兼容的 `FormItemRule`。Arco 使用 `FieldRule`，支持 `required`、`type`、`message`、`validator`、`validate-trigger` 等，但字段名和错误返回结构不同。

判断：

- `autoRules` 这个高级 API 应保留。
- 底层规则对象需要在 Arco 版重新定义，不应直接复用 Element Plus 的 `FormItemRule` 类型。
- `validate()` 的外部返回语义需要稳定下来。当前 `FormExpose.validate` 注释是“成功返回表单数据，失败返回错误信息”。Arco 原生 `validate` 返回 errors，需要封装为当前高级组件期望的结果。

需要确认：

- `validate()` 是否继续保持“成功 resolve model，失败 reject errors”的语义？
- 自定义 validator 是否要求兼容当前 Element Plus 写法，还是接受 Arco `FieldRule.validator` 写法？

### Form：布局能力

Element Plus 版本依赖 `ElRow/ElCol`、`ElForm`、自定义 schema layout。Arco Form 原生有 `layout`、`label-col-props`、`wrapper-col-props`、`auto-label-width`，FormItem 还有 `row-props`、`content-class`、`content-flex`。

判断：

- 当前 schema layout 不应该完全交给 Arco Form 原生布局，否则配置驱动能力会受限。
- Arco 的 `Grid/Row/Col` 能替代 Element Plus 的 `ElRow/ElCol`，但布局 props 需要重新命名或做适配。
- `descriptions` 模式需要单独验证 Arco `Descriptions` 的 API 差异。

需要确认：

- 是否继续由高级 Form 的 schema layout 控制布局，而不是暴露 Arco Form 原生 grid 配置为主？
- 是否允许 Arco 版布局属性与 Element Plus 版略有差异？

### Table：继续自建列体系，但底层接 Arco `TableColumn`

Arco Table 同时支持 `columns` 属性和 `<TableColumn>` 子组件。官方文档说明 `columns` 插槽启用时会屏蔽 `columns` 属性，`TableColumn` 提供 `cell` slot，参数包含 `record`、`column`、`rowIndex`。

判断：

- 不采用 Arco `columns` 模式作为主实现。
- 保留当前 `TableColumn[]` DSL，由内部 `renderTableColumns()` 动态生成 Arco `TableColumn` 子组件。
- 当前 `RenderTableColumn.tsx` 可作为结构参考，但大部分 JSX 需要重写。

需要确认：

- 是否把“禁用官方 columns 模式，统一走自建 TableColumn DSL”定为硬规则？
- 是否保留一个低优先级逃生口，例如 `rawColumns`，允许用户直接传 Arco columns？当前倾向是不保留，避免破坏高级组件定位。

### Table：selection / radio / expand

Element Plus 当前用特殊 `ElTableColumn type="selection"`、自绘 radio、`type="expand"`。Arco Table 把选择与展开提升为表格级 props：`row-selection`、`selected-keys`、`expandable`、`expanded-keys`，并提供 `select/selectAll/expand` 方法。

判断：

- `selection` 可以优先复用 Arco `row-selection`，但当前事件输出是 selected rows，需要从 selected keys 映射回 row objects。
- `radio` 可以用 Arco `row-selection.type = 'radio'`，但如果要完全保留当前“radio 是一个普通列”的视觉和事件语义，可能继续自绘更可控。
- `expand` 可以优先复用 Arco `expandable.expandedRowRender`，但要验证与自建列顺序、固定列、插槽 `expand` 的兼容。

需要确认：

- `selection` 是否可以从“列配置渲染 selection 列”改为“列配置触发表格级 row-selection”？
- `radio` 更看重复用 Arco 选择能力，还是保持当前自绘列的完全可控性？
- `expand` 是否允许改为 Arco 表格级 expandable，而不是子列 `type=expand`？

### Table：editable 单元格校验

当前编辑表格在 `RenderTable.tsx` 中用 `ElForm model={props.modelValue}` 包裹 `ElTable`，再在单元格里使用 `ElFormItem prop="${index}.${field}"`。

Arco 版可以采用同类结构：

```tsx
<AForm model={props.modelValue}>
  <ATable data={props.modelValue}>
    <ATableColumn>
      {{
        cell: ({ record, rowIndex }) => (
          <AFormItem field={`${rowIndex}.${field}`}>
            {renderEditComponent(record, rowIndex)}
          </AFormItem>
        )
      }}
    </ATableColumn>
  </ATable>
</AForm>
```

判断：

- 技术路径成立，但这是最高优先级 spike。
- 风险在于排序、筛选、分页、虚拟滚动后 `rowIndex` 是否仍对应 `modelValue` 原数组索引。
- 如果 Arco Table 的 `rowIndex` 是当前视图索引，则编辑校验路径必须改为基于 row key 的映射，不能直接使用 `rowIndex`。

需要确认：

- 当前 Element Plus 版是否支持客户端排序/筛选后继续编辑？如果支持，Arco 版必须设计稳定索引映射。
- 是否要求首版支持虚拟滚动下的 editable 校验？当前建议首版暂不支持。

### Pagination 和 Loading

当前分页独立使用 `ElPagination`，Table loading 使用 Element Plus `vLoading` 指令。

Arco Table 原生支持 `pagination` 和 `loading` props，也有独立 Pagination/Spin 组件。

判断：

- Loading 应直接改为 Arco Table 的 `loading` prop，删除指令式依赖。
- Pagination 建议仍保持外置分页器或受控包装，不直接使用 Arco Table 内置分页作为核心状态源。这样更容易保留当前 `page`、`pageSize`、`total`、`page-change` 语义。

需要确认：

- Arco 版 Table 是否继续使用外置 Pagination 渲染，以最大限度保持现有 API？
- 是否允许样式和交互细节跟随 Arco，而只保证事件和数据语义一致？

## 下一轮建议确认的问题

为了继续收敛，请优先确认以下设计原则：

1. `formItemProps` 是否改为 Arco 原生语义，不提供 Element Plus props 兼容层？
2. `validate()` 是否继续保持当前高级组件语义：成功返回 model，失败返回 errors？
3. Table 是否把“自建 TableColumn DSL，不暴露官方 columns 模式”定为硬规则？
4. `selection/radio/expand` 是否允许在外部仍表现为列配置，但内部转为 Arco 表格级能力？
5. editable Table 首版是否可以不支持虚拟滚动下的校验？
