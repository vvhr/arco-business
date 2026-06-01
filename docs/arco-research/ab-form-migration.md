# Form 迁移差异报告

## 迁移目标

本轮新增组件已迁移到 `src/components/Form`，组件名为 `Form`。组件不导入旧 Form 的类型、工具、hook、render 或子组件。允许复用项目级通用能力，例如 `locale`、`tree`、`get/set`、`AbIcon`、`AbUpload`、`AbText`、`AbComboInput` 和当前 Table 组件。

`Form` 保留原有 schema 渲染引擎思想：由 schema 描述布局、容器、装饰组件、输入组件和自定义渲染，再统一生成表单。迁移重点是将 Element Plus 的组件、属性和样式语义替换为 Arco Design Vue。

## Form 差异

Element Plus 的 `el-form` 以 `label-position`、`label-width` 和 `inline` 等属性组织布局；Arco 的 `a-form` 使用 `layout`、`label-align`、`label-col-props`、`wrapper-col-props`，并在 `a-form-item` 支持 `label-col-flex` 固定标题宽度。

处理方案：

- 移除 `labelPosition`，改为 `layout` 与 `labelAlign`。
- 移除顶层 `labelWidth`，固定标题宽度使用 `labelColFlex`。
- `FormProps` 继承 Arco Form props，但排除 `model`、`layout`、`labelAlign`、`disabled`、`rules`、`autoLabelWidth`、`id`、`scrollToFirstError` 等由组件统一接管的属性。
- `disabled` 不透传给 `a-form`。顶层禁用只作为内部状态参与具体输入组件的禁用计算，避免 Arco Form 原生禁用态限制局部字段启用。

## FormItem 差异

旧 Form 为了补足 Element Plus 标题栏扩展能力，提供了 `subLabel`、`subLabelRender`、`labelMaxWidth` 和手动 label slot 拼装。Arco `a-form-item` 原生提供 `extra` 与 `help`，同时支持 label/wrapper 栅格能力。

处理方案：

- 移除 `subLabel`、`subLabelRender`、`labelMaxWidth`。
- 静态说明使用 `formItemProps.extra`、`formItemProps.help`。
- 函数式说明使用 `extraRender`、`helpRender`。
- 插槽改为 `${key}--extra` 与 `${key}--help`。
- 不再实现 `renderFormItemLabel`，只在用户显式提供 `${key}--label` 时透传 label slot。
- `FormItemProps` 继承 Arco FormItem props，并排除 `field`、`label`、`disabled`、`rules` 等由 schema 或 Form 接管的字段。

## Grid 与 Anchor 差异

Element Plus 的 `el-row/el-col` 与 Arco 的 `a-row/a-col` 基础语义接近，但 Arco Form 本身也依赖 Grid 风格的 label/wrapper 分配。

处理方案：

- schema 布局继续使用 `layoutProps.span`、`layoutProps.alone`、`layoutProps.colStyle`。
- 内部渲染替换为 Arco `Row`、`Col`。
- 锚点替换为 Arco `Anchor`、`AnchorLink`，通过 schema 的 `anchorLinkProps` 控制是否展示。

## 校验库与错误类型

Arco Design Vue 2.58.0 的 Form 校验能力来自 `b-validate`，不是 `async-validator`。因此新版 Form 不再暴露 Element Plus 的 `FormItemRule`、`ValidateError`、`ValidateFieldsError`。

处理方案：

- schema 规则类型改为 Arco `FieldRule | FieldRule[]`。
- 校验错误类型改为 `ValidatedError` 与 `Record<string, ValidatedError>`。
- `src/utils/rules.ts` 同步迁移为返回 `Record<AutoRules, FieldRule>`。
- 自动规则的 validator 兼容 Arco 的 `(value, callback)` 调用方式，同时保留最小运行时兼容，避免旧 Form 在并行阶段立即失效。

## 组件属性差异

旧 Form 面向 Element Plus 暴露了 `clearable`、`optionKeys` 等属性。Arco 对应语义为 `allowClear` 与 `fieldNames`，组件名也不同。

处理方案：

- `ComponentProps.clearable` 改为 `allowClear`，不做旧字段兼容。
- `optionKeys` 改为 `fieldNames`，不做旧字段兼容。
- schema 组件名采用 Arco 语义：`AutoComplete`、`CheckboxGroup`、`RadioGroup`、`RangePicker`、`TimePicker` 等。
- Arco 2.58.x 未提供独立 `Segmented` 组件导出，因此当前 `Segmented` 语义映射到 `RadioGroup` 的按钮形态，后续若项目升级 Arco 可替换为原生组件。

## 数组默认值

Element Plus 与 Arco 在多选态判断上不完全一致，不能沿用旧 `defaultArrayStrategies`。

处理方案：

- `CheckboxGroup`、`InputTag`、`Transfer`、`Table`、`RangePicker` 恒为数组。
- `Select` 根据 `multiple` 判断。
- `TreeSelect` 根据 `multiple || treeCheckable` 判断。
- `TimePicker` 根据 `type === 'time-range'` 判断。
- `Cascader` 根据 `multiple || pathMode !== false` 判断。

## desc 模式移除

旧 Form 的 `desc`/Descriptions 模式与表单渲染职责混杂，迁移 Arco 时不再保留。

处理方案：

- 新版 Form 只保留 schema form 模式。
- 不迁移 Descriptions 相关渲染、类型和样式。
- 如需描述列表，后续应独立设计 Descriptions 组件，而不是放入 Form。

## 样式迁移

Element Plus 类名和 CSS 变量不再出现在新版 Form 中。

处理方案：

- 所有内部类名前缀使用 `ab-form`。
- 颜色、边框、背景、文字等样式使用 Arco CSS 变量，例如 `--color-border-2`、`--color-fill-1`、`--color-text-1`。
- 行内编辑、无标题字段和禁用展示只影响 Form 自身结构，不依赖 Element Plus 的类名。
